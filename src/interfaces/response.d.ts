export default interface Response {
  status: 200 | 201 | 400 | 401 | 403 | 404 | 500
  body: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}