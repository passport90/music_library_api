import pg from 'pg'
import Action from '../interfaces/action'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const artistShowAction: Action = async (
  pathParams: string[],
  _queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const id = pathParams[0]
  const res = await pgClient.query({
    text: 'select name from artist where id = $1',
    values: [id],
  })

  if (res.rows.length === 0) {
    throw { code: 404, message: `There is no artist with ID ${id}.`}
  }

  // Deserialize sort-safe name
  const artist = res.rows[0]
  const matches = artist.name.match(/^(.+), The$/)
  let displayArtistName
  if (matches !== null) {
    displayArtistName = `The ${matches[1]}`
  }
  
  return { status: 200, body: { ...artist, name: displayArtistName ?? artist.name } }
}

export default artistShowAction