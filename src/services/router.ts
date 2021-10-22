import http2 from 'http2'
import Exception from '../interfaces/exception'
import Route from '../interfaces/route'
import RoutingResult from '../interfaces/routingResult'

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
} = http2.constants

export default class Router {
  public constructor(private routes: Route[]) { }
  public route = (headers: http2.IncomingHttpHeaders): RoutingResult => {
    const method = headers[HTTP2_HEADER_METHOD] as string
    const fullPath = headers[HTTP2_HEADER_PATH] as string

    const [path, queryString] = fullPath.split('?') 

    for (const route of this.routes) {
      if (route.method !== method) {
        continue
      } 
      
      const matches = path.match(route.path)      
      if (matches === null) {
        continue
      }

      return {
        pathParams: matches.slice(1),
        queryParams: new URLSearchParams(queryString),
        action: route.action,
      }
    }

    const exception: Exception = {
      code: 404,
      message: `Resource not found for route: ${method} ${fullPath}.`
    }
    throw exception
  } 
}