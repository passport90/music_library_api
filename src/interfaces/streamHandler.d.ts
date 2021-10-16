import http2 from 'http2'
import ServerHttp2StreamInterface from './node/serverHttp2StreamInterface'

export default interface StreamHandler {
  (stream: ServerHttp2StreamInterface, headers: http2.IncomingHttpHeaders): void
}