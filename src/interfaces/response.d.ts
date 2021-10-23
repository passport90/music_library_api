import StandardObject from './standardObject'

export default interface Response {
  status: 200 | 201 | 400 | 401 | 403 | 404 | 405 | 422 | 500
  body: StandardObject
}