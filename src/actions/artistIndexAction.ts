import pg from 'pg'
import Action from '../interfaces/action'
import Artist from '../interfaces/models/artist'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const artistIndexAction: Action = async (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const res = await pgClient.query('select id, name from artist order by name')
  const artists: Artist[] = res.rows
  
  return { status: 200, body: { artists } }
}

export default artistIndexAction