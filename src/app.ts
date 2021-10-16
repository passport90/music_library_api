import ErrorHandler from './interfaces/errorHandler'
import StreamHandler from './interfaces/streamHandler'
import Application from './services/application'
import EnvironmentVariableChecker from './services/environmentVariableChecker'
import Filesystem from './services/node/filesystem.js'
import Http2Service from './services/node/http2Service.js'
import Server from './services/server.js'

const environmentVariableChecker = new EnvironmentVariableChecker()
const application = new Application(environmentVariableChecker)
application.run(process.argv)

let port = 443 
if (process.argv.length > 2) {
  port = parseInt(process.argv[2])
  if (!(1 << 10 <= port && port < 1 << 16)) {
    throw new Error(
      `Specified port is invalid!: ${port}. `
      + `Port should be an integer between ${1 << 10} and ${(1 << 16) - 1}.`
    )
  }
}

const http2Service = new Http2Service()
const filesystem = new Filesystem()
const server = new Server(filesystem, http2Service)

const streamHandler: StreamHandler = (stream, _headers) => {
  stream.respond({
    'content-type': 'text/plain; charset=utf-8',
    ':status': 200
  })
  stream.end('Hello, World!')
}

const errorHandler: ErrorHandler = (error) => console.log(error)

server.run(
  port,
  streamHandler,
  errorHandler,
  process.env.SSL_PRIVATE_KEY_FILEPATH as string,
  process.env.SSL_CERTIFICATE_FILEPATH as string,
)