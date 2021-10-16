import { Client } from 'pg'
import Action from '../interfaces/action'
import Response from '../interfaces/response'

const dishIndexAction: Action = (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  _body: Record<string, any> | null
): Response => {
  const client = new Client()
  client.connect()
  
  return {
    status: 200, body: _body
  }
}

export default dishIndexAction