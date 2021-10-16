import ServerHttp2StreamInterface from './node/serverHttp2StreamInterface'

export default interface StreamHandler {
  (stream: ServerHttp2StreamInterface): void
}