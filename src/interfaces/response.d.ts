import RequestBody from './requestBody'

export default interface Response {
  status: 200 | 201 | 400 | 401 | 403 | 404 | 405 | 500
  body: RequestBody
}