import Model from '../interfaces/model'
import StandardObject from '../interfaces/standardObject'

export default class Artist implements Model {
  public constructor(private id: number, private name: string) { }

  public serialize = (): StandardObject => {
    return { id: this.id, name: this.getDisplayName() }
  }

  private getDisplayName = (): string => {
    const matches = this.name.match(/^(.*), The$/) 
    return matches !== null ? `The ${matches[1]}` : this.name
  }
}