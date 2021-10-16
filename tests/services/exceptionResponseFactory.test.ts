import Exception from '../../src/interfaces/exception'
import ExceptionResponseFactory from '../../src/services/exceptionResponseFactory'

describe('ExceptionResponseFactory', () => {
  describe('build', () => {
    it('creates a response based on error code and message', () => {
      const exception: Exception = {
        code: 500,
        message: 'This is an error message',
      }

      const exceptionResponseFactory = new ExceptionResponseFactory()
      const response = exceptionResponseFactory.build(exception)

      expect(response).toStrictEqual({
        status: 500,
        body: { message: 'This is an error message' }
      })
    })
  })
})