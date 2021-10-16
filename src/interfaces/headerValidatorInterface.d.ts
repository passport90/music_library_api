import http2 from 'http2'

export default interface HeaderValidatorInterface {
  validate: (headers: http2.IncomingHttpHeaders) => void
}