import http2 from 'http2'
import Http2ServiceInterface from '../../interfaces/http2ServiceInterface'

export default class Http2Service implements Http2ServiceInterface {
  public createSecureServer = (options: http2.SecureServerOptions): http2.Http2SecureServer => {
    return http2.createSecureServer(options)
  }
}