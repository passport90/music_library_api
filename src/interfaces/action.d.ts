import { Clinet as PostgreSQLClient } from 'pg'
import Response from './response'

export default interface Action {
  (
    pathParams: string[],
    queryParams: URLSearchParams,
    requestBody: Record<string, any> | null,
    pgClient: PostgreSQLClient,
  ): Response
}