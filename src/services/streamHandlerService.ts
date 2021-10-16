import ServerHttp2StreamInterface from '../interfaces/node/serverHttp2StreamInterface'
import StreamHandlerServiceInterface from '../interfaces/streamHandlerServiceInterface'

export default class StreamHandlerService implements StreamHandlerServiceInterface {
  public handle = (stream: ServerHttp2StreamInterface) => {
    stream.respond({
      'content-type': 'text/plain; charset=utf-8',
      ':status': 200
    })
    stream.end('Hello, world!')
  }
}