import http2 from 'http2'

export default interface ServerHttp2StreamInterface {
  respond: (headers?: http2.OutgoingHttpHeaders) => void
  end: (str: string) => void;
}