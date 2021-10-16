import http2 from 'http2'
import Http2SecureServerInterface from './http2SecureServerInterface'

export default interface Http2ServiceInterface {
  createSecureServer: (options: http2.SecureServerOptions) => Http2SecureServerInterface
}