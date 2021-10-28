import dateFNS from 'date-fns'
import pg from 'pg'
import Action from '../interfaces/action'
import Exception from '../interfaces/exception'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const spotifyIdRegex = /^[a-zA-Z0-9]{22}$/ 

const trackUpdateAction: Action = async (
  pathParams: string[],
  _queryParams: URLSearchParams,
  body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const id = pathParams[0]

  await pgClient.query('begin transaction isolation level serializable')
  try {
    // Check existence
    const trackExistRes = await pgClient.query({
      text: 'select exists(select 1 from track where id = $1) as track_exists',
      values: [id],
    })
    if (trackExistRes.rows[0].track_exists === false) {
      const exception: Exception = { code: 404, message: `There is no track with ID ${id}.`, isException: true }
      throw exception
    }

    if (body === null) {
      const exception: Exception = { code: 400, message: 'Request body not sent.', isException: true }
      throw exception
    }

    // Validate & resolve request body
    const { title, releaseDate, spotifyId, isLoved } = body
    const stringFields: Record<string, unknown> = { title, releaseDate, spotifyId }
    for (const key in stringFields) {
      if (typeof stringFields[key] !== 'string') {
        const exception: Exception = {
          code: 400,
          message: `Invalid request body: ${key} field value must be a string.`,
          isException: true,
        }
        throw exception
      }
    }

    if (dateFNS.parseISO(`${releaseDate as string}T00:00:00Z`).toString() === 'Invalid Date') {
      const exception: Exception = {
        code: 400,
        message: 'Invalid request body: releaseDate field value must be a valid date in YYYY-MM-DD format.',
        isException: true,
      }
      throw exception
    }

    if ((spotifyId as string).match(spotifyIdRegex) === null) {
      const exception: Exception = {
        code: 400,
        message: 'Invalid request body: spotifyId field must consists of 22 alphanumeric characters.',
        isException: true,
      }
      throw exception
    }

    if (typeof isLoved !== 'boolean') {
      const exception: Exception = {
        code: 400,
        message: 'Invalid request body: isLoved field value must be a boolean.',
        isException: true,
      }
      throw exception
    }

    const spotifyIdTrackExistRes = await pgClient.query({
      text: 'select exists(select 1 from track where spotify_id = $1 and id <> $2) as track_exists',
      values: [spotifyId, id]
    })
    if (spotifyIdTrackExistRes.rows[0].track_exists === true) {
      const exception: Exception = {
        code: 400,
        message: `Track with spotify ID ${spotifyId} already exists.`,
        isException: true
      }
      throw exception
    }



    // Execute update
    await pgClient.query({
      text: 'update track set title = $1, release_date = $2, spotify_id = $3, is_loved = $4 where id = $5',
      values: [title, releaseDate, spotifyId, isLoved, id]
    })

    // Commit
    await pgClient.query('commit')
  } catch (error) {
    await pgClient.query('rollback')
    throw error
  }
    
  return { status: 200, body: { message: 'Update successful.' } }
}

export default trackUpdateAction