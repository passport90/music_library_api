import dateFNS from 'date-fns'
import Model from '../interfaces/model'
import StandardObject from '../interfaces/standardObject'
import Artist from './artist'

export default class Track implements Model {
  public constructor(
    private id: number,
    private title: string,
    private releaseDate: Date,
    private spotifyId: string,
    private mainArtists: Artist[],
    private guestArtists: Artist[],
  ) { }

  public serialize = (): StandardObject => {
    return {
      id: this.id,
      title: this.title,
      releaseDate: dateFNS.format(this.releaseDate, 'yyyy-MM-dd'),
      spotifyId: this.spotifyId,
      mainArtists: this.mainArtists.map((artist) => artist.serialize()),
      guestArtists: this.guestArtists.map((artist) => artist.serialize()),
    }
  }
}