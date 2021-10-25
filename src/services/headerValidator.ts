import http2 from 'http2'
import Exception from '../interfaces/exception'
import HeaderValidatorInterface from '../interfaces/headerValidatorInterface'

const {
  HTTP2_HEADER_AUTHORIZATION,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_METHOD_GET,
  HTTP2_METHOD_POST,
  HTTP2_METHOD_HEAD,
  HTTP2_METHOD_OPTIONS,
  HTTP2_METHOD_PUT,
} = http2.constants

const ALLOWED_HTTP_METHODS = [
  HTTP2_METHOD_GET,
  HTTP2_METHOD_POST,
  HTTP2_METHOD_HEAD,
  HTTP2_METHOD_OPTIONS,
  HTTP2_METHOD_PUT,
]
export default class HeaderValidator implements HeaderValidatorInterface {
  public validate = (headers: http2.IncomingHttpHeaders): void => {
    const {
      [HTTP2_HEADER_AUTHORIZATION]: authorization,
      [HTTP2_HEADER_METHOD]: method,
      [HTTP2_HEADER_CONTENT_TYPE]: contentType,
    } = headers

    if (!(typeof method === 'string' && ALLOWED_HTTP_METHODS.includes(method))) {
      const exception: Exception = {
        code: 405,
        message: `HTTP method ${method} is not allowed.`,
        isException: true,
      }
      throw exception
    }

    if (authorization !== `Bearer ${process.env.AUTH_TOKEN}`) {
      const exception: Exception = {
        code: 401,
        message: 'Authorization token is either incorrect or invalid.',
        isException: true,
      }
      throw exception
    }

    if ((method === HTTP2_METHOD_POST || method === HTTP2_METHOD_PUT) && contentType !== 'application/json') {
      const exception: Exception = {
        code: 400,
        message: 'Only application/json content type is accepted on POST and PUT requests.',
        isException: true,
      }
      throw exception
    }
  }
}