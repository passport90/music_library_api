import Model from '../interfaces/model'

export default class Artist implements Model {
  constructor(private id: number, private name: string) { }

  public serialize = () => {
    return {
      id: this.id,
      name: this.getDisplayName()
    }
  }

  private getDisplayName = (): string => {
    const matches = this.name.match(/^(.*), The$/) 
    return matches !== null ? `The ${matches[1]}` : this.name
  }
}