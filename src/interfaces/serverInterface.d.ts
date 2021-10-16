import ErrorHandler from './errorHandler'
import StreamHandler from './streamHandler'

export default interface ServerInterface {
  run: (
    port: number,
    streamHandler: StreamHandler,
    errorHandler: ErrorHandler,
    sslPrivateKeyFilePath: string,
    sslCertificateFilePath: string,
  ) => void
}