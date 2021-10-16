import ServerHttp2StreamInterface from './node/serverHttp2StreamInterface'
import Response from './response'

export default interface ResponderInterface {
  respond: (response: Response, stream: ServerHttp2StreamInterface) => void
}