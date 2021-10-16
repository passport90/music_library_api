export default interface ArgumentParserInterface {
  getPort: (argv: string[], defaultPort: number) => number
}