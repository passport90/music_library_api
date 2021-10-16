import Action from '../interfaces/action'
import Response from '../interfaces/response'

const dishIndexAction: Action = (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  _body: Record<string, any> | null
): Response => {
  return {
    status: 200, body: { message: 'Hello' }
  }
}

export default dishIndexAction