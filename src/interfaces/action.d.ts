import pg from 'pg'
import RequestBody from './requestBody'
import Response from './response'

export default interface Action {
  (
    pathParams: string[],
    queryParams: URLSearchParams,
    requestBody: RequestBody,
    pgClient: pg.Client,
  ): Promise<Response>
}