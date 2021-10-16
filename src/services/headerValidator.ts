import http2 from 'http2'
import Exception from '../interfaces/exception'
import HeaderValidatorInterface from '../interfaces/headerValidatorInterface'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_METHOD_POST,
} = http2.constants

export default class HeaderValidator implements HeaderValidatorInterface {
  public validate = (headers: http2.IncomingHttpHeaders): void => {
    if (
      headers[HTTP2_HEADER_METHOD] === HTTP2_METHOD_POST
      && headers[HTTP2_HEADER_CONTENT_TYPE] !== 'application/json'
    ) {
      const exception: Exception = {
        code: 400,
        message: 'Only application/json content type is accepted on POST requests.'
      }
      throw exception
    }
  }
}