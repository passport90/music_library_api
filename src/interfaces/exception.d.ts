export default interface Exception {
  code: 400 | 401 | 403 | 404 | 405 | 500
  message: string,
}