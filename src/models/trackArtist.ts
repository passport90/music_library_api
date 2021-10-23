import Model from '../interfaces/model'
import StandardObject from '../interfaces/standardObject'
import Artist from './artist'

export default class TrackArtist implements Model {
  public constructor(private artist: Artist, private isMain: boolean) { }
  public serialize = (): StandardObject => {
    return { ...this.artist.serialize(), isMain: this.isMain }
  }
} 