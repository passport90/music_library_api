import pg from 'pg'
import Action from '../interfaces/action'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'
import Artist from '../models/artist.js'

const artistIndexAction: Action = async (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const res = await pgClient.query('select id, name from artist order by name limit 100')
  const artists = res.rows.map((row) => new Artist(row.id, row.name))
  
  return { status: 200, body: { artists: artists.map((artist) => artist.serialize()) } }
}

export default artistIndexAction