import dateFNS from 'date-fns'
import pg from 'pg'
import Action from '../interfaces/action'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const spotifyIdRegex = /^[a-zA-Z0-9]{22}$/ 

const trackCreateAction: Action = async (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  if (body === null) {
    throw { code: 400, message: 'Request body not sent.' }
  }

  // Validate & resolve request body
  const { title, releaseDate, spotifyId, artists } = body
  const stringFields: Record<string, unknown> = { title, releaseDate, spotifyId }
  for (const key in stringFields) {
    if (typeof stringFields[key] !== 'string') {
      throw { code: 400, message: `Invalid request body: ${key} field value must be a string.`}
    }
  }

  try {
    dateFNS.parseISO(`${releaseDate as string}T00:00:00Z`)    
  } catch (error) {
    if (error !== 'Invalid Date') {
      throw error
    }

    throw {
      code: 400, message: 'Invalid request body: releaseDate field value must be a valid date in YYYY-MM-DD format.'
    }
  }

  if ((spotifyId as string).match(spotifyIdRegex) === null) {
    throw { code: 400, message: 'Invalid request body: spotifyId field must consists of 22 alphanumeric characters.'}
  }


  if (!(Array.isArray(artists) && artists.length > 0)) {
    throw { code: 400, message: 'Invalid request body: artists field value must be a non-empty array.' }
  }

  let trackId
  await pgClient.query('begin')
  try {
    for (const artist of artists) {
      const { id, isMain } = artist
      if (!(Number.isInteger(id) && id > 0)) {
        throw { code: 400, message: 'Invalid request body: artist ID must be a positive integer.' }
      }
      if (typeof isMain !== 'boolean') {
        throw { code: 400, message: 'Invalid request body: isMain field value must be a boolean.' }
      }

      const artistExistRes = await pgClient.query({
        text: 'select exists(select 1 from artist where id = $1) as artist_exists',
        values: [id]
      })

      if (artistExistRes.rows[0].artists_exists === false) {
        throw { code: 422, message: `There is no artist with ID ${id}.`}
      }
    }

    // Execute insert
    const insertTrackRes = await pgClient.query({
      text: 'insert into track (title, release_date, spotify_id) values ($1, $2, $3) returning id',
      values: [title, releaseDate, spotifyId]
    })
    trackId = insertTrackRes.rows[0].id

    for (const artist of artists) {
      const { id, isMain } = artist
      await pgClient.query({
        text: 'insert into artist_track (artist_id, track_id, is_main) values ($1, $2, $3)',
        values: [id, trackId, isMain]
      })
    }

    // Commit
    await pgClient.query('commit')
  } catch (error) {
    await pgClient.query('rollback')
    throw error
  }
    
  return { status: 201, body: { id: trackId } }
}

export default trackCreateAction