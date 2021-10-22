import { URLSearchParams } from "url";
import Action from "./action";
import RequestBody from "./requestBody";

export default interface RoutingResult {
  pathParams: string[],
  queryParams: URLSearchParams,
  action: Action,
}