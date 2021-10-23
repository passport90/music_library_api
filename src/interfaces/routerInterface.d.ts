import http2 from 'http2'
import RoutingResult from './routingResult'

export default interface RouterInterface {
  route: (headers: http2.IncomingHttpHeaders) => RoutingResult
}