import http2 from 'http2'
import Http2Service from '../../../src/services/node/http2Service'

jest.mock('http2')

describe('Http2Service', () => {
  describe('createSecureServer', () => {
    it('creates a secure http2 server', () => {
      const stubOptions = {}
      const stubServer = {};

      (http2.createSecureServer as jest.Mock).mockImplementation(
        (options) => options === stubOptions ? stubServer : null
      )
      const http2Service = new Http2Service()

      const server = http2Service.createSecureServer(stubOptions)

      expect(server).toBe(stubServer)
    })
  })
})