import Exception from '../interfaces/exception'
import ExceptionResponseFactoryInterface from '../interfaces/exceptionResponseFactoryInterface'
import Response from '../interfaces/response'

export default class ExceptionResponseFactory implements ExceptionResponseFactoryInterface {
  public build = (error: Exception): Response => {
    {
      const response: Response = {
        status: error.code,
        body: { message: error.message }
      }
      return response
    }
  }   
}