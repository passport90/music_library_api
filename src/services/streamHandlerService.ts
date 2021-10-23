import http2 from 'http2'
import { Client as PostgreSQLClient } from 'pg'
import Exception from '../interfaces/exception'
import ExceptionResponseFactoryInterface from '../interfaces/exceptionResponseFactoryInterface'
import HeaderValidatorInterface from '../interfaces/headerValidatorInterface'
import ServerHttp2StreamInterface from '../interfaces/node/serverHttp2StreamInterface'
import RequestBodyParserInterface from '../interfaces/requestBodyParserInterface'
import ResponderInterface from '../interfaces/responderInterface'
import Response from '../interfaces/response'
import RouterInterface from '../interfaces/routerInterface'
import StreamHandlerServiceInterface from '../interfaces/streamHandlerServiceInterface'

const { HTTP2_HEADER_METHOD, HTTP2_METHOD_HEAD } = http2.constants

export default class StreamHandlerService implements StreamHandlerServiceInterface {
  public constructor(
    private headerValidator: HeaderValidatorInterface,
    private exceptionResponseFactory: ExceptionResponseFactoryInterface,
    private responder: ResponderInterface,
    private router: RouterInterface,
    private requestBodyParser: RequestBodyParserInterface,
    private pgClient: PostgreSQLClient,
  ) { }

  public handle = (stream: ServerHttp2StreamInterface, headers: http2.IncomingHttpHeaders) => {
    const chunks: string[] = []
    stream.on('data', (chunk) => {
      chunks.push(chunk.toString())
    })

    stream.on('end', async () => {
      if (headers[HTTP2_HEADER_METHOD] === HTTP2_METHOD_HEAD) {
        this.responder.respond({status: 200, body: null}, stream)
        return
      }

      let response: Response
      try {
        this.headerValidator.validate(headers)

        const { pathParams, queryParams, action } = this.router.route(headers)
        const requestBody = this.requestBodyParser.parse(chunks)
        response = await action(pathParams, queryParams, requestBody, this.pgClient)

        this.responder.respond(response, stream)
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'isException' in error) {
          response = this.exceptionResponseFactory.build(error as Exception)
        } else {
          console.log(error)
          const exception: Exception = { code: 500, message: 'Internal server error.', isException: true }
          response = this.exceptionResponseFactory.build(exception)
        } 

        this.responder.respond(response, stream)
      }
    })

  }
}