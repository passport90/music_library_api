import ErrorHandler from '../../src/interfaces/errorHandler'
import FilesystemInterface from '../../src/interfaces/filesystemInterface'
import Http2SecureServerInterface from '../../src/interfaces/http2SecureServerInterface'
import Http2ServiceInterface from '../../src/interfaces/http2ServiceInterface'
import StreamHandler from '../../src/interfaces/streamHandler'
import Server from '../../src/services/server'

describe('Server', () => {
  describe('run', () => {
    it('runs the server', () => {
      const oldEnv = process.env

      const stubPort = 12345
      const stubStreamHandler = (() => null) as StreamHandler
      const stubErrorHandler = (() => null) as ErrorHandler

      const stubPrivateKeyFilePath = '/path/to/private/key'
      const stubCertificateFilePath = '/path/to/certificate'
      process.env.SSL_PRIVATE_KEY_FILEPATH = stubPrivateKeyFilePath
      process.env.SSL_CERTIFICATE_FILEPATH = stubCertificateFilePath

      const stubPrivateKey = Buffer.from('private key')
      const stubCertificate = Buffer.from('certificate')

      const stubFilesystem: FilesystemInterface = {
        readFileSync: (path) => {
          const map: { [index: string]: Buffer } = {
            [stubPrivateKeyFilePath]: stubPrivateKey,
            [stubCertificateFilePath]: stubCertificate,
          }

          if (typeof path !== 'string' || !(path in map)) {
            throw new Error()
          }
          
          return map[path]
        }
      }

      const mockSecureServer: Http2SecureServerInterface = { on: jest.fn(), listen: jest.fn() }

      const stubHttp2Service: Http2ServiceInterface = {
        createSecureServer: (options) => {
          if (
            !(
              options.key?.toString() === stubPrivateKey.toString()
              && options.cert?.toString() === stubCertificate.toString() 
            )
          ) {
            throw new Error()
          }

          return mockSecureServer
        }      
      }

      const server = new Server(stubFilesystem, stubHttp2Service)
      server.run(stubPort, stubStreamHandler, stubErrorHandler, stubPrivateKeyFilePath, stubCertificateFilePath)
      
      expect(mockSecureServer.on).toHaveBeenCalledWith('error', stubErrorHandler)
      expect(mockSecureServer.on).toHaveBeenCalledWith('stream', stubStreamHandler)
      expect(mockSecureServer.listen).toHaveBeenCalledWith(stubPort)
      expect(mockSecureServer.listen).toHaveBeenCalledTimes(1)

      process.env = oldEnv
    })
  })
})