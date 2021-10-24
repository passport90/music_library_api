import pg from 'pg'
import Action from '../interfaces/action'
import Exception from '../interfaces/exception'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const artistUpdateAction: Action = async (
  pathParams: string[],
  _queryParams: URLSearchParams,
  body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const id = pathParams[0]

  await pgClient.query('begin transaction isolation level serializable')
  try {
    // Check existence
    const artistExistRes = await pgClient.query({
      text: 'select exists(select 1 from track where id = $1) as artist_exists',
      values: [id],
    })
    if (artistExistRes.rows[0].artist_exists === false) {
      const exception: Exception = { code: 404, message: `There is no artist with ID ${id}.`, isException: true }
      throw exception
    }

    if (body === null) {
      const exception: Exception = { code: 400, message: 'Request body not sent.', isException: true }
      throw exception
    }

    // Validate & resolve request body
    const { name } = body
    if (typeof name !== 'string') {
      const exception: Exception = {
        code: 400,
        message: 'Invalid request body: name field value must be a string.',
        isException: true,
      }
      throw exception
    }

    // Store as sort-safe name
    const matches = name.match(/^The (.+)$/)
    let sortSafeName
    if (matches !== null) {
      sortSafeName = `${matches[1]}, The`
    }

    // Execute
    await pgClient.query({
      text: 'update artist set name = $1 where id = $2',
      values: [sortSafeName ?? name, id],
    })
    // Commit
    await pgClient.query('commit')
  } catch (error) {
    await pgClient.query('rollback')
    throw error
  }

  return { status: 200, body: { message: 'Update successful.' } }
}

export default artistUpdateAction