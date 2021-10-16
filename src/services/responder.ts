import http2 from 'http2'
import ServerHttp2StreamInterface from '../interfaces/node/serverHttp2StreamInterface'
import ResponderInterface from '../interfaces/responderInterface'
import Response from '../interfaces/response'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_STATUS,
} = http2.constants

export default class Responder implements ResponderInterface {
  public respond = (response: Response, stream: ServerHttp2StreamInterface): void => {
    stream.respond({
      [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      [HTTP2_HEADER_STATUS]: response.status,
    })
    stream.end(JSON.stringify(response.body))
  }
}