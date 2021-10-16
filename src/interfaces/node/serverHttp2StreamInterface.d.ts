import http2 from 'http2'

export default interface ServerHttp2StreamInterface {
  end: (str: string) => void
  on(event: 'data', listener: (chunk: Buffer | string) => void): void
  on(event: 'end', listener: () => void): void
  read: () => string | Buffer | null | any
  respond: (headers?: http2.OutgoingHttpHeaders) => void
}