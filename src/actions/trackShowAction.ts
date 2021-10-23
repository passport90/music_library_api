import pg from 'pg'
import Action from '../interfaces/action'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const trackShowAction: Action = async (
  pathParams: string[],
  _queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const id = pathParams[0]
  let track

  await pgClient.query('begin transaction isolation level serializable')
  try {
    const res = await pgClient.query({
      text: 'select title, release_date, spotify_id from track where id = $1',
      values: [id],
    })

    if (res.rows.length === 0) {
      throw { code: 404, message: `There is no track with ID ${id}.`}
    }
    const { title, release_date: releaseDate, spotify_id: spotifyId } = res.rows[0]

    const artistRes = await pgClient.query({
      text: `
        select artist_id, name, is_main
        from artist_track
          join artist
            on artist_track.artist_id = artist.id
        where track_id = $1
      `,
      values: [id],
    })
    await pgClient.query('commit')

    const artists = artistRes.rows.map((artistRow) => {
      return { id: artistRow.artist_id, name: artistRow.name, isMain: artistRow.is_main } 
    })

    track = { title, releaseDate, spotifyId, artists }
  } catch (error) {
    await pgClient.query('rollback')
    throw error
  }

  return { status: 200, body: track }
}

export default trackShowAction