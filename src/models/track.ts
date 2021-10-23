import dateFNS from 'date-fns'
import Model from '../interfaces/model'

export default class Track implements Model {
  constructor(private id: number, private title: string, private releaseDate: Date, private spotifyId: string) { }

  public serialize = () => {
    return {
      id: this.id,
      title: this.title,
      releaseDate: dateFNS.format(this.releaseDate, 'yyyy-MM-dd'),
      spotifyId: this.spotifyId
    }
  }
}