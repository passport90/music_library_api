import dateFNS from 'date-fns'
import pg from 'pg'
import Action from '../interfaces/action'
import Exception from '../interfaces/exception'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'
import StandardObject from '../interfaces/standardObject'
import Artist from '../models/artist.js'
import Track from '../models/track.js'

const trackIndexAction: Action = async (
  _pathParams: string[],
  queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const releaseDateStart = queryParams.get('release_date_start')
  const releaseDateEnd = queryParams.get('release_date_end')

  validateReleaseDateArgs([releaseDateStart, releaseDateEnd])
  const { clause: whereClause, values } = constructWhereClause(releaseDateStart, releaseDateEnd)

  const res = await pgClient.query({
    text: `
      select
        track.id,  
        title,
        release_date,
        spotify_id,
        is_loved,
        array_agg(json_build_object('id', artist.id, 'name', name) order by name)
          filter (where is_main = true) as main_artists,
        array_agg(json_build_object('id', artist.id, 'name', name) order by name)
          filter (where is_main = false) as guest_artists
      from track
        join artist_track
          on track.id = track_id
        join artist
          on artist_id = artist.id 
      ${whereClause}
      group by track.id, title, release_date, spotify_id
      order by release_date, title, id
    `,
    values
  })

  const tracks = res.rows.map((row) => {
    const {
      id,
      title,
      release_date: releaseDate,
      spotify_id: spotifyId,
      is_loved: isLoved,
      main_artists: mainArtistObjects,
      guest_artists: guestArtistObjects,
    } = row

    const [mainArtists, guestArtists] = [mainArtistObjects, guestArtistObjects].map((artistObjects) => {
      return artistObjects?.map((artistObject: StandardObject) => {
        const { id, name } = artistObject
        return new Artist(id, name)
      }) ?? []
    })

    return new Track(id, title, releaseDate, spotifyId, isLoved, mainArtists, guestArtists)
  })


  return { status: 200, body: { tracks: tracks.map((track) => track.serialize()) } }
}

const validateReleaseDateArgs = (releaseDateArgs: (string | null)[]): void => {
  releaseDateArgs.forEach((dateArg) => {
    if (dateArg === null) {
      return
    }

    if (dateFNS.parseISO(`${dateArg}T00:00:00Z`).toString() === 'Invalid Date') {
      const message = 'Invalid request body: release_date_start or release_date_end parameter argument must be a valid '
                      + 'date in YYYY-MM-DD format.'
      const exception: Exception = { code: 400, message, isException: true }
      throw exception
    }
  })
}

const constructWhereClause = (releaseDateStart: string | null , releaseDateEnd: string | null): {
  clause: string,
  values: string[],
} => {
  const clauseElements: string[] = [] 
  const values: string[] = []
  if (releaseDateStart !== null) {
    clauseElements.push('release_date >= $1')
    values.push(releaseDateStart)
  }
  if (releaseDateEnd !== null) {
    clauseElements.push('release_date <= $2')
    values.push(releaseDateEnd)
  }

  const clause = clauseElements.length > 0 ? `where ${clauseElements.join(' and ')}` : ''
  return { clause, values }
}

export default trackIndexAction