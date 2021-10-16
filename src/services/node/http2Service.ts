import http2 from 'http2'
import Http2SecureServerInterface from '../../interfaces/http2SecureServerInterface'
import Http2ServiceInterface from '../../interfaces/http2ServiceInterface'

export default class Http2Service implements Http2ServiceInterface {
  public createSecureServer = (options: http2.SecureServerOptions): Http2SecureServerInterface => {
    return http2.createSecureServer(options)
  }
}