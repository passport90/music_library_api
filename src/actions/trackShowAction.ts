import pg from 'pg'
import Action from '../interfaces/action'
import Exception from '../interfaces/exception'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'
import Artist from '../models/artist.js'
import Track from '../models/track.js'

const trackShowAction: Action = async (
  pathParams: string[],
  _queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const id = pathParams[0]

  await pgClient.query('begin transaction isolation level serializable')
  let trackRes, trackArtistRes
  try {
    trackRes = await pgClient.query({
      text: 'select title, release_date, spotify_id from track where id = $1',
      values: [id],
    })

    if (trackRes.rows.length === 0) {
      const exception: Exception = { code: 404, message: `There is no track with ID ${id}.`, isException: true }
      throw exception
    }

    trackArtistRes = await pgClient.query({
      text: `
        select id, name, is_main
        from artist_track
          join artist
            on artist_id = artist.id
        where track_id = $1
        order by name
      `,
      values: [id],
    })
    await pgClient.query('commit')
  } catch (error) {
    await pgClient.query('rollback')
    throw error
  }

  const mainArtists: Artist[] = []
  const guestArtists: Artist[] = []
  for (const row of trackArtistRes.rows) {
    const { id, name, is_main: isMain } = row
    const artist = new Artist(id, name)
    if (isMain) {
      mainArtists.push(artist)
    } else {
      guestArtists.push(artist)
    }
  }
  
  const { title, release_date: releaseDate, spotify_id: spotifyId } = trackRes.rows[0]
  const track = new Track(parseInt(id), title, releaseDate, spotifyId, mainArtists, guestArtists)

  return { status: 200, body: track.serialize() }
}

export default trackShowAction