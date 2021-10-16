import http2 from 'http2'
import Response from './response'

export default interface RouterInterface {
  handle: (headers: http2.IncomingHttpHeaders, requestBody: Record<string, any> | null) => Response
}