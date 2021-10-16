import http2 from 'http2'

export default interface Http2ServiceInterface {
  createSecureServer: (options: http2.SecureServerOptions) => http2.Http2SecureServer
}