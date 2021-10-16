import http2 from 'http2'
import Responder from '../../src/services/responder'
import Response from '../../src/interfaces/response'
import ServerHttp2StreamInterface from '../../src/interfaces/node/serverHttp2StreamInterface'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_STATUS,
} = http2.constants

describe('Responder', () => {
  describe('respond', () => {
    it('sends response to stream', () => {
      const stubResponse: Response = {
        status: 404,
        body: { message: 'Resource not found', name: 'Omelette', done: true }
      }

      const mockStream: ServerHttp2StreamInterface = { respond: jest.fn(), end: jest.fn() }

      const responder = new Responder()
      responder.respond(stubResponse, mockStream)

      expect(mockStream.respond).toHaveBeenCalledTimes(1)
      expect(mockStream.respond).toHaveBeenCalledWith({
        [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
        [HTTP2_HEADER_STATUS]: 404
      })

      expect(mockStream.end).toHaveBeenCalledTimes(1)
      expect(mockStream.end).toHaveBeenCalledWith(
        '{"message":"Resource not found","name":"Omelette","done":true}'
      )
    })

    it('Does not write body to stream if response has null body', () => {
      const stubResponse: Response = { status: 200, body: null }

      const mockStream: ServerHttp2StreamInterface = { respond: jest.fn(), end: jest.fn() }

      const responder = new Responder()
      responder.respond(stubResponse, mockStream)

      expect(mockStream.respond).toHaveBeenCalledTimes(1)
      expect(mockStream.respond).toHaveBeenCalledWith({
        [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
        [HTTP2_HEADER_STATUS]: 200
      })

      expect(mockStream.end).not.toHaveBeenCalled()
    })
  })
})