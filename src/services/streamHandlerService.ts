import http2 from 'http2'
import HeaderValidatorInterface from '../interfaces/headerValidatorInterface'
import ServerHttp2StreamInterface from '../interfaces/node/serverHttp2StreamInterface'
import ResponderInterface from '../interfaces/responderInterface'
import StreamHandlerServiceInterface from '../interfaces/streamHandlerServiceInterface'

export default class StreamHandlerService implements StreamHandlerServiceInterface {
  public constructor(
    private headerValidator: HeaderValidatorInterface,
    private responder: ResponderInterface,
  ) { }

  public handle = (stream: ServerHttp2StreamInterface, headers: http2.IncomingHttpHeaders) => {
    this.headerValidator.validate(headers)

    this.responder.respond(
      {
        status: 200,
        body: { message: 'Hello, world!' }
      },
      stream,
    )
  }
}