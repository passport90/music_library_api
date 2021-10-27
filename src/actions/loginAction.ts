import jwt from 'jsonwebtoken'
import pg from 'pg'
import Action from '../interfaces/action'
import Exception from '../interfaces/exception'
import RequestBody from '../interfaces/requestBody'
import Response from '../interfaces/response'

const loginAction: Action = async (
  _pathParams: string[],
  _queryParams: URLSearchParams,
  body: RequestBody,
  _pgClient: pg.Client
): Promise<Response> => {
  if (body === null) {
    const exception: Exception = { code: 400, message: 'Request body not sent.', isException: true }
    throw exception
  }

  const { username, password } = body

  // Validate & resolve request body
  const stringFields: Record<string, unknown> = { username, password }
  for (const key in stringFields) {
    if (typeof stringFields[key] !== 'string') {
      const exception: Exception = {
        code: 400,
        message: `Invalid request body: ${key} field value must be a string.`,
        isException: true,
      }
      throw exception
    }
  }
  
  if (!(username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD)) {
    const exception: Exception = { code: 401, message: 'Incorrect username or password', isException: true }
    throw exception
  }

  const token = jwt.sign({ loggedIn: true }, process.env.JWT_SECRET as string, { expiresIn: '1d' })

  return { status: 200, body: { token } }
}

export default loginAction