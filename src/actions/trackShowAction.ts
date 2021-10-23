import pg from 'pg'
import Action from '../interfaces/action'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'
import Artist from '../models/artist.js'
import Track from '../models/track.js'
import TrackArtist from '../models/trackArtist.js'

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
      throw { code: 404, message: `There is no track with ID ${id}.`}
    }

    trackArtistRes = await pgClient.query({
      text: `
        select id, name, is_main
        from artist_track
          join artist
            on artist_id = artist.id
        where track_id = $1
      `,
      values: [id],
    })
    await pgClient.query('commit')
  } catch (error) {
    await pgClient.query('rollback')
    throw error
  }

  const { title, release_date: releaseDate, spotify_id: spotifyId } = trackRes.rows[0]
  const trackArtists = trackArtistRes.rows.map((row) => {
    const { id, name, is_main: isMain } = row
    const artist = new Artist(id, name)
    return new TrackArtist(artist, isMain)
  })
  const track = new Track(parseInt(id), title, releaseDate, spotifyId, trackArtists)

  return { status: 200, body: track.serialize() }
}

export default trackShowAction