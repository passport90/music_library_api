import pg from 'pg'
import Action from '../interfaces/action'
import Exception from '../interfaces/exception'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const artistCreateAction: Action = async (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
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
  const insertArtistRes = await pgClient.query({
    text: 'insert into artist (name) values ($1) returning id',
    values: [sortSafeName ?? name],
  })
  const { id } = insertArtistRes.rows[0]
    
  return { status: 201, body: { id } }
}

export default artistCreateAction