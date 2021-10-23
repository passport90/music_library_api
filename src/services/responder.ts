import http2 from 'http2'
import ServerHttp2StreamInterface from '../interfaces/node/serverHttp2StreamInterface'
import ResponderInterface from '../interfaces/responderInterface'
import Response from '../interfaces/response'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN,
} = http2.constants

export default class Responder implements ResponderInterface {
  public respond = (response: Response, stream: ServerHttp2StreamInterface): void => {
    stream.respond({
      [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      [HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN]: '*',
      [HTTP2_HEADER_STATUS]: response.status,
    })

    if (response.body === null) {
      return
    }

    stream.end(JSON.stringify(response.body))
  }
}