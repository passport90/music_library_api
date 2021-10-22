import http2 from 'http2'
import RequestBody from './requestBody'
import Response from './response'
import RoutingResultInterface from './routingResult'

export default interface RouterInterface {
  route: (headers: http2.IncomingHttpHeaders) => RoutingResult
}