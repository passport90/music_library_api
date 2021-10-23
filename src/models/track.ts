import dateFNS from 'date-fns'
import Model from '../interfaces/model'
import StandardObject from '../interfaces/standardObject'
import TrackArtist from './trackArtist'

export default class Track implements Model {
  public constructor(
    private id: number,
    private title: string,
    private releaseDate: Date,
    private spotifyId: string,
    private artists: TrackArtist[],
  ) { }

  public serialize = (): StandardObject => {
    return {
      id: this.id,
      title: this.title,
      releaseDate: dateFNS.format(this.releaseDate, 'yyyy-MM-dd'),
      spotifyId: this.spotifyId,
      artists: this.artists.map((artist) => artist.serialize()),
    }
  }
}