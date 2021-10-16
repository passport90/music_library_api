import http2 from 'http2'
import Exception from '../../src/interfaces/exception'
import HeaderValidator from '../../src/services/headerValidator'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_METHOD_POST,
} = http2.constants

describe('HeaderValidator', () => {
  describe('validate', () => {
    const invalidPostContentTypes = [
      'application/x-www-form-urlencoded',
      'text/plain',
      'text/html',
      'multipart/form-data',
    ]
    it('does not throw error if method is POST and content-type is JSON', () => {
      const headerValidator = new HeaderValidator()
      expect(() => headerValidator.validate({
        [HTTP2_HEADER_METHOD]: HTTP2_METHOD_POST,
        [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      })).not.toThrow()
    })

    it.each(invalidPostContentTypes)('throw error if method is POST and content-type is not JSON', (contentType) => {
      const headerValidator = new HeaderValidator()
      try {
        headerValidator.validate({
          [HTTP2_HEADER_METHOD]: HTTP2_METHOD_POST,
          [HTTP2_HEADER_CONTENT_TYPE]: contentType,
        })
      } catch (error) {
        expect((error as Exception).code).toBe(400)
      }
    })
  })
})