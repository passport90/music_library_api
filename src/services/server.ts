import StreamHandler from '../interfaces/streamHandler'
import ErrorHandler from '../interfaces/errorHandler'
import FilesystemInterface from '../interfaces/node/filesystemInterface'
import Http2ServiceInterface from '../interfaces/node/http2ServiceInterface'

export default class Server {
  constructor(
    private filesystem: FilesystemInterface,
    private http2Service: Http2ServiceInterface,
  ) { }

  public run = (
    port: number,
    streamHandler: StreamHandler,
    errorHandler: ErrorHandler,
    sslPrivateKeyFilePath: string,
    sslCertificateFilePath: string,
  ) => {
    const sslPrivateKey = this.filesystem.readFileSync(sslPrivateKeyFilePath) 
    const sslCertificate = this.filesystem.readFileSync(sslCertificateFilePath)
    const server = this.http2Service.createSecureServer({ key: sslPrivateKey, cert: sslCertificate })

    server.on('error', errorHandler)
    server.on('stream', streamHandler)

    server.listen(port)
  }
}