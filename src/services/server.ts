import StreamHandler from '../interfaces/streamHandler'
import ErrorHandler from '../interfaces/errorHandler'
import FilesystemInterface from '../interfaces/node/filesystemInterface'
import Http2ServiceInterface from '../interfaces/node/http2ServiceInterface'
import ServerInterface from '../interfaces/serverInterface'

export default class Server implements ServerInterface {
  constructor(
    private filesystem: FilesystemInterface,
    private http2Service: Http2ServiceInterface,
  ) { }

  public serve = (
    port: number,
    streamHandler: StreamHandler,
    errorHandler: ErrorHandler,
    sslPrivateKeyFilePath: string,
    sslCertificateFilePath: string,
  ) => {
    const sslPrivateKey = this.filesystem.readFileSync(sslPrivateKeyFilePath) 
    const sslCertificate = this.filesystem.readFileSync(sslCertificateFilePath)
    const http2Server = this.http2Service.createSecureServer({ key: sslPrivateKey, cert: sslCertificate })

    http2Server.on('error', errorHandler)
    http2Server.on('stream', streamHandler)

    http2Server.listen(port)
  }
}