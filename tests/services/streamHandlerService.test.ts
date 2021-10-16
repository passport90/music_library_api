import ServerHttp2StreamInterface from '../../src/interfaces/node/serverHttp2StreamInterface'
import StreamHandlerService from '../../src/services/streamHandlerService'

describe('StreamHandlerService', () => {
  describe('handle', () => {
    it('responds with plain text hello world with status 200', () => {
      const streamHandlerService = new StreamHandlerService()

      const stream: ServerHttp2StreamInterface = { respond: jest.fn(), end: jest.fn() }
      streamHandlerService.handle(stream)

      expect(stream.respond).toHaveBeenCalledTimes(1)
      expect(stream.respond).toHaveBeenCalledWith({
        'content-type': 'text/plain; charset=utf-8',
        ':status': 200
      })

      expect(stream.end).toHaveBeenCalledTimes(1)
      expect(stream.end).toHaveBeenCalledWith('Hello, world!')
    })
  })
})