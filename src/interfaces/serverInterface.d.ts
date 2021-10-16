import ErrorHandler from './errorHandler'
import StreamHandler from './streamHandler'

export default interface ServerInterface {
  serve: (
    port: number,
    streamHandler: StreamHandler,
    errorHandler: ErrorHandler,
    sslPrivateKeyFilePath: string,
    sslCertificateFilePath: string,
  ) => void
}