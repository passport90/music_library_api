import http2 from 'http2'
import StreamHandler from '../interfaces/streamHandler'
import ErrorHandler from '../interfaces/errorHandler'
import Filesystem from './filesystem'

export default class Server {
  constructor(private filesystem: Filesystem) {}

  public run = (
    port: number,
    streamHandler: StreamHandler,
    errorHandler: ErrorHandler,
    sslPrivateKeyFilePath: string,
    sslCertificateFilePath: string,
  ) => {
    const sslPrivateKey = this.filesystem.readFileSync(sslPrivateKeyFilePath) 
    const sslCertificate = this.filesystem.readFileSync(sslCertificateFilePath)
    const server = http2.createSecureServer({ key: sslPrivateKey, cert: sslCertificate })

    server.on('error', errorHandler)
    server.on('stream', streamHandler)

    server.listen(port)
  }
}