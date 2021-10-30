import StreamHandler from '../interfaces/streamHandler'
import FilesystemInterface from '../interfaces/node/filesystemInterface'
import Http2ServiceInterface from '../interfaces/node/http2ServiceInterface'
import ServerInterface from '../interfaces/serverInterface'

export default class Server implements ServerInterface {
  public constructor(
    private filesystem: FilesystemInterface,
    private http2Service: Http2ServiceInterface,
  ) { }

  public serve = (
    port: number,
    streamHandler: StreamHandler,
    sslPrivateKeyFilePath: string,
    sslCertificateFilePath: string,
  ) => {
    const sslPrivateKey = this.filesystem.readFileSync(sslPrivateKeyFilePath) 
    const sslCertificate = this.filesystem.readFileSync(sslCertificateFilePath)
    const http2Server = this.http2Service.createSecureServer({ key: sslPrivateKey, cert: sslCertificate })

    http2Server.on('error', (error: unknown) => {
      if (
        typeof error === 'object'
        && error !== null
        && 'code' in error
        && (error as { code: string }).code === 'ECONNRESET'
      ) {
        http2Server.listen(port)
        return
      }
      console.error(error)
    })
    http2Server.on('stream', streamHandler)

    http2Server.listen(port)
  }
}