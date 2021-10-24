import dateFNS from 'date-fns'
import pg from 'pg'
import Action from '../interfaces/action'
import Exception from '../interfaces/exception'
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
    const exception: Exception = { code: 400, message: 'Request body not sent.', isException: true }
    throw exception
  }

  // Validate & resolve request body
  const { title, releaseDate, spotifyId, isLoved, mainArtistIds, guestArtistIds } = body

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

  try {
    dateFNS.parseISO(`${releaseDate as string}T00:00:00Z`)    
  } catch (error) {
    if (error !== 'Invalid Date') {
      throw error
    }

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

  if (!(Array.isArray(mainArtistIds) && mainArtistIds.length > 0)) {
    const exception: Exception = {
      code: 400,
      message: 'Invalid request body: mainArtistIds field value must be a non-empty array.',
      isException: true,
    }
    throw exception
  }

  if (!Array.isArray(guestArtistIds)) {
    const exception: Exception = {
      code: 400,
      message: 'Invalid request body: guestArtistIds field value must be an array.',
      isException: true,
    }
    throw exception
  }

  const artistIds = mainArtistIds.concat(guestArtistIds) 
  artistIds.forEach(id => {
    if (!(Number.isInteger(id) && id > 0)) {
      const exception: Exception = {
        code: 400,
        message: 'Invalid request body: artist ID must be a positive integer.',
        isException: true,
      }
      throw exception
    }
  })

  mainArtistIds.forEach(mainArtistId => {
    if (guestArtistIds.includes(mainArtistId)) {
      const exception: Exception = {
        code: 400,
        message: 'Invalid request body: A main artist cannot also be a guest artist.',
        isException: true,
      }
      throw exception
    }
  })

  let trackId: number
  await pgClient.query('begin transaction isolation level serializable')
  try {
    const trackExistRes = await pgClient.query({
      text: 'select exists(select 1 from track where spotify_id = $1) as track_exists',
      values: [spotifyId]
    })
    if (trackExistRes.rows[0].track_exists === true) {
      const exception: Exception = {
        code: 400,
        message: `Track with spotify ID ${spotifyId} already exists.`,
        isException: true
      }
      throw exception
    }

    for (const id of artistIds) {
      const artistExistRes = await pgClient.query({
        text: 'select exists(select 1 from artist where id = $1) as artist_exists',
        values: [id],
      })
      if (artistExistRes.rows[0].artists_exists === false) {
        const exception: Exception = { code: 400, message: `There is no artist with ID ${id}.`, isException: true }
        throw exception
      }
    }

    // Execute insert
    const insertTrackRes = await pgClient.query({
      text: 'insert into track (title, release_date, spotify_id, is_loved) values ($1, $2, $3, $4) returning id',
      values: [title, releaseDate, spotifyId, isLoved]
    })
    trackId = insertTrackRes.rows[0].id

    for (const id of mainArtistIds) {
      await pgClient.query({
        text: 'insert into artist_track (artist_id, track_id, is_main) values ($1, $2, $3)',
        values: [id, trackId, true],
      })
    }
    for (const id of guestArtistIds) {
      await pgClient.query({
        text: 'insert into artist_track (artist_id, track_id, is_main) values ($1, $2, $3)',
        values: [id, trackId, false],
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