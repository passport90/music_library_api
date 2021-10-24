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
      group by track.id, title, release_date, spotify_id
      order by release_date
    `,
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

export default trackIndexAction