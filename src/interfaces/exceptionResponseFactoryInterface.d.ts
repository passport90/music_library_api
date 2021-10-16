import Exception from './exception'
import Response from './response'

export default interface ExceptionResponseFactoryInterface {
  build: (error: Exception) => Response
}