import http2 from 'http2'
import Exception from '../../src/interfaces/exception'
import ExceptionResponseFactoryInterface from '../../src/interfaces/exceptionResponseFactoryInterface'
import HeaderValidatorInterface from '../../src/interfaces/headerValidatorInterface'
import ServerHttp2StreamInterface from '../../src/interfaces/node/serverHttp2StreamInterface'
import ResponderInterface from '../../src/interfaces/responderInterface'
import Response from '../../src/interfaces/response'
import StreamHandlerService from '../../src/services/streamHandlerService'


describe('StreamHandlerService', () => {
  describe('handle', () => {
    it('responds to the request using responder', () => {
      const mockHeaderValidator: HeaderValidatorInterface = { validate: jest.fn() }
      const mockResponder: ResponderInterface = { respond: jest.fn() }
      const stubExceptionResponseFactory: ExceptionResponseFactoryInterface = {
        build: () => { return { status: 500, body: {} }}
      }

      const streamHandlerService = new StreamHandlerService(
        mockHeaderValidator,
        stubExceptionResponseFactory,
        mockResponder
      )

      const stubHeaders: http2.IncomingHttpHeaders = {}
      const mockStream: ServerHttp2StreamInterface = { respond: jest.fn(), end: jest.fn() }

      streamHandlerService.handle(mockStream, stubHeaders)

      expect(mockHeaderValidator.validate).toHaveBeenCalledTimes(1)
      expect(mockHeaderValidator.validate).toHaveBeenCalledWith(stubHeaders)

      expect(mockResponder.respond).toHaveBeenCalledTimes(1)
      expect(mockResponder.respond).toHaveBeenCalledWith(
        {
          status: 200,
          body: { message: 'Hello, world!' }
        },
        mockStream
      )
    })

    it('responds to the request using responder if exception raised when validating header', () => {
      const stubException: Exception = { code: 400, message: 'Invalid headers' }
      const stubExceptionResponse: Response = { status: 400, body: {} }

      const mockHeaderValidator: HeaderValidatorInterface = {
        validate: jest.fn().mockImplementation(() => { throw stubException })
      }
      const stubExceptionResponseFactory: ExceptionResponseFactoryInterface = {
        build: (error: Exception): Response => {
          if (error !== stubException) {
            throw new Error()
          }

          return stubExceptionResponse
        }
      }
      const mockResponder: ResponderInterface = { respond: jest.fn() }

      const streamHandlerService = new StreamHandlerService(
        mockHeaderValidator,
        stubExceptionResponseFactory,
        mockResponder,
      )

      const stubHeaders: http2.IncomingHttpHeaders = {}
      const stubStream: ServerHttp2StreamInterface = { respond: () => true, end: () => true }

      streamHandlerService.handle(stubStream, stubHeaders)

      expect(mockHeaderValidator.validate).toHaveBeenCalledTimes(1)
      expect(mockHeaderValidator.validate).toHaveBeenCalledWith(stubHeaders)

      expect(mockResponder.respond).toHaveBeenCalledTimes(1)
      expect(mockResponder.respond).toHaveBeenCalledWith(stubExceptionResponse, stubStream)
    })
  })
})