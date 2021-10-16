import http2 from 'http2'
import Exception from '../interfaces/exception'
import HeaderValidatorInterface from '../interfaces/headerValidatorInterface'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_METHOD_GET,
  HTTP2_METHOD_POST,
  HTTP2_METHOD_HEAD,
} = http2.constants

const ALLOWED_HTTP_METHODS = [
  HTTP2_METHOD_GET,
  HTTP2_METHOD_POST,
  HTTP2_METHOD_HEAD,
]
export default class HeaderValidator implements HeaderValidatorInterface {
  public validate = (headers: http2.IncomingHttpHeaders): void => {
    const {
      [HTTP2_HEADER_METHOD]: method,
      [HTTP2_HEADER_CONTENT_TYPE]: contentType,
    } = headers

    if (!(typeof method === 'string' && ALLOWED_HTTP_METHODS.includes(method))) {
      const exception: Exception = {
        code: 405,
        message: `HTTP method ${method} is not allowed.`
      }
      throw exception
    }

    if (method === HTTP2_METHOD_POST && contentType !== 'application/json') {
      const exception: Exception = {
        code: 400,
        message: 'Only application/json content type is accepted on POST requests.'
      }
      throw exception
    }
  }
}