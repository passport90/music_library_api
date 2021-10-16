export default interface RequestBodyParserInterface {
  parse: (chunks: string[]) => Record<string, any> | null
}