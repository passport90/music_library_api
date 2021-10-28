import { URLSearchParams } from 'url'
import Action from './action'

export default interface RoutingResult {
  pathParams: string[],
  queryParams: URLSearchParams,
  action: Action,
  authenticationRequired: boolean
}