import ErrorHandler from '../errorHandler'
import StreamHandler from '../streamHandler'

export default interface Http2SecureServerInterface {
  on(event: 'error', listener: ErrorHandler): this;
  on(event: 'stream', listener: StreamHandler): this;
  listen: (port: number) => void
}