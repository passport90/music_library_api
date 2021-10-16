import http2 from 'http2'
import Exception from '../interfaces/exception'
import ExceptionResponseFactoryInterface from '../interfaces/exceptionResponseFactoryInterface'
import HeaderValidatorInterface from '../interfaces/headerValidatorInterface'
import ServerHttp2StreamInterface from '../interfaces/node/serverHttp2StreamInterface'
import ResponderInterface from '../interfaces/responderInterface'
import StreamHandlerServiceInterface from '../interfaces/streamHandlerServiceInterface'

export default class StreamHandlerService implements StreamHandlerServiceInterface {
  public constructor(
    private headerValidator: HeaderValidatorInterface,
    private exceptionResponseFactory: ExceptionResponseFactoryInterface,
    private responder: ResponderInterface,
  ) { }

  public handle = (stream: ServerHttp2StreamInterface, headers: http2.IncomingHttpHeaders) => {
    try {
      this.headerValidator.validate(headers)
    } catch (error) {
      if (!(typeof error === 'object' && error !== null && 'code' in error && 'message' in error)) {
        throw error
      }

      const response = this.exceptionResponseFactory.build(error as Exception)
      this.responder.respond(response, stream)
      return
    }

    this.responder.respond(
      {
        status: 200,
        body: { message: 'Hello, world!' }
      },
      stream,
    )
  }
}