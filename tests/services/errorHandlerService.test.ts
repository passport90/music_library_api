import ErrorHandlerService from '../../src/services/errorHandlerService'

describe('ErrorHandlerService', () => {
  describe('handle', () => {
    it('logs the error to console', () => {
      const originalLogFunction = console.log

      console.log = jest.fn()

      const error = new Error('This is an error.')

      const errorHandlerService = new ErrorHandlerService()
      errorHandlerService.handle(error)

      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith(error)

      console.log = originalLogFunction
    })
  })
})