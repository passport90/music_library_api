import Exception from '../interfaces/exception'
import RequestBody from '../interfaces/requestBody'
import RequestBodyParserInterface from '../interfaces/requestBodyParserInterface'

export default class RequestBodyParser implements RequestBodyParserInterface {
  public parse = (chunks: string[]): RequestBody => {
    if (chunks.length === 0) {
      return null
    }
    
    try {
      const parseResult = JSON.parse(chunks.join(''))  
      if (parseResult instanceof Array) {
        throw new SyntaxError('Request body must be a JSON object.')
      }

      return parseResult
    } catch (error) {
      if (error instanceof SyntaxError) {
        const exception: Exception = {
          code: 400,
          message: `Error occurred when parsing request body: ${error.message}` 
        }
        throw exception
      }

      throw error
    }
  }
}