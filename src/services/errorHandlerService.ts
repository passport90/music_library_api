import ErrorHandlerServiceInterface from '../interfaces/errorHandlerServiceInterface'

export default class ErrorHandlerService implements ErrorHandlerServiceInterface {
  public handle = (error: Error) => {
    console.log(error)
  }
}