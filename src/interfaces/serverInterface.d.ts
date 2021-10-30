import StreamHandler from './streamHandler'

export default interface ServerInterface {
  serve: (
    port: number,
    streamHandler: StreamHandler,
    sslPrivateKeyFilePath: string,
    sslCertificateFilePath: string,
  ) => void
}