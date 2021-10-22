import { Client as PostgreSQLClient } from 'pg'
import Action from '../interfaces/action'
import Response from '../interfaces/response'

const artistIndexAction: Action = (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  _body: Record<string, any> | null,
  _client: PostgreSQLClient
): Response => {
  
  return {
    status: 200, body: _body
  }
}

export default artistIndexAction