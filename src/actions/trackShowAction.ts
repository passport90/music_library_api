import dateFNS from 'date-fns'
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

  const res = await pgClient.query({
    text: 'select title, release_date, spotify_id from track where id = $1',
    values: [id],
  })

  if (res.rows.length === 0) {
    throw { code: 404, message: `There is no track with ID ${id}.`}
  }
  const { title, release_date: releaseDate, spotify_id: spotifyId } = res.rows[0]
  const track = { title, releaseDate, spotifyId }

  return { status: 200, body: { ...track, releaseDate: dateFNS.format(track.releaseDate, 'yyyy-MM-dd') } }
}

export default trackShowAction