import RequestBody from './requestBody'

export default interface RequestBodyParserInterface {
  parse: (chunks: string[]) => RequestBody
}