import http2 from 'http2'
import Exception from '../../src/interfaces/exception'
import HeaderValidator from '../../src/services/headerValidator'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_METHOD_GET,
  HTTP2_METHOD_DELETE,
  HTTP2_METHOD_OPTIONS,
  HTTP2_METHOD_PATCH,
  HTTP2_METHOD_POST,
  HTTP2_METHOD_PUT,
} = http2.constants

describe('HeaderValidator', () => {
  describe('validate', () => {
    it('does not throw error if method is POST and content-type is JSON', () => {
      const headerValidator = new HeaderValidator()
      expect(() => headerValidator.validate({
        [HTTP2_HEADER_METHOD]: HTTP2_METHOD_POST,
        [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      })).not.toThrow()
    })

    it.each([
      'application/x-www-form-urlencoded',
      'text/plain',
      'text/html',
      'multipart/form-data',
    ])('throws error if method is POST and content-type is not JSON', (contentType) => {
      const headerValidator = new HeaderValidator()
      let errorThrown = false

      try {
        headerValidator.validate({
          [HTTP2_HEADER_METHOD]: HTTP2_METHOD_POST,
          [HTTP2_HEADER_CONTENT_TYPE]: contentType,
        })
      } catch (error) {
        errorThrown = true
        expect((error as Exception).code).toBe(400)
      }

      expect(errorThrown).toBe(true)
    })

    it('does not throw error if method is GET', () => {
      const headerValidator = new HeaderValidator()
      expect(() => headerValidator.validate({
        [HTTP2_HEADER_METHOD]: HTTP2_METHOD_GET,
      })).not.toThrow()
    })
    
    it.each([
      HTTP2_METHOD_DELETE,
      HTTP2_METHOD_OPTIONS,
      HTTP2_METHOD_PATCH,
      HTTP2_METHOD_PUT
    ])('throws 405 error if method is not HEAD, GET or POST', (unsupportedMethod) => {
      const headerValidator = new HeaderValidator()
      let errorThrown = false
      try {
        headerValidator.validate({ [HTTP2_HEADER_METHOD]: unsupportedMethod })
      } catch (error) {
        errorThrown = true
        expect((error as Exception).code).toBe(405)
      }

      expect(errorThrown).toBe(true)
    })
  })
})