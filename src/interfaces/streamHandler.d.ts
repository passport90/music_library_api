import http2 from 'http2'

export default interface StreamHandler {
  (
    stream: http2.ServerHttp2Stream,
    headers: http2.IncomingHttpHeaders,
    flags: number,
  ): void
}