import pg from 'pg'
import Action from '../interfaces/action'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const artistIndexAction: Action = async (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const res = await pgClient.query('select id, name from artist order by name')
  const artists = res.rows

  const displayArtists = artists.map((artist) => {
    const matches = artist.name.match(/^(.+), The$/)
    let displayArtistName
    if (matches !== null) {
      displayArtistName = `The ${matches[1]}`
    }
    return { ...artist, name: displayArtistName ?? artist.name }
  })
  
  return { status: 200, body: { artists: displayArtists } }
}

export default artistIndexAction