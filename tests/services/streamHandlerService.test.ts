import http2 from 'http2'
import HeaderValidatorInterface from '../../src/interfaces/headerValidatorInterface'
import ServerHttp2StreamInterface from '../../src/interfaces/node/serverHttp2StreamInterface'
import ResponderInterface from '../../src/interfaces/responderInterface'
import StreamHandlerService from '../../src/services/streamHandlerService'


describe('StreamHandlerService', () => {
  describe('handle', () => {
    it('responds to the request using responder', () => {
      const mockHeaderValidator: HeaderValidatorInterface = { validate: jest.fn() }
      const mockResponder: ResponderInterface = { respond: jest.fn() }

      const streamHandlerService = new StreamHandlerService(mockHeaderValidator, mockResponder)

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
  })
})