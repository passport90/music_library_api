import pg from 'pg'
import Action from '../interfaces/action'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'
import StandardObject from '../interfaces/standardObject'
import Artist from '../models/artist.js'
import Track from '../models/track.js'

const trackIndexAction: Action = async (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  _body: RequestBody,
  pgClient: pg.Client
): Promise<Response> => {
  const res = await pgClient.query({
    text: `
      select
        id,  
        title,
        release_date,
        spotify_id,
        array_agg(json_build_object("id", id, "name", name) order by name)
          filter (where is_main = true) as main_artists,
        array_agg(json_build_object("id", id, "name", name) order by name)
          filter (where is_main = false) as guest_artists,
      from track
        join artist_track
          on track.id = track_id
        join artist
          on artist_id = artist.id 
      group by title, release_date, spotify_id
      order by release_date
    `,
  })

  const tracks = res.rows.map((row) => {
    const {
      id,
      title,
      release_date: releaseDate,
      spotify_id: spotifyId,
      main_artists: mainArtistObjects,
      guest_artists: guestArtistObjects,
    } = row
    const mainArtists = mainArtistObjects.map((mainArtistObject: StandardObject) => {
      const { id, name } = mainArtistObject
      return new Artist(id, name)
    })
    const guestArtists = guestArtistObjects.map((guestArtistObject: StandardObject) => {
      const { id, name } = guestArtistObject
      return new Artist(id, name)
    })
    return new Track(id, title, releaseDate, spotifyId, mainArtists, guestArtists)
  })


  return { status: 200, body: { tracks: tracks.map((track) => track.serialize()) } }
}

export default trackIndexAction