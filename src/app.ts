import Application from './services/application'
import ArgumentParser from './services/argumentParser'
import EnvironmentVariableChecker from './services/environmentVariableChecker'

const environmentVariableChecker = new EnvironmentVariableChecker()
const argumentParser = new ArgumentParser()
const application = new Application(environmentVariableChecker, argumentParser)

// Run Application
application.run(process.argv)

process.exit()

// const http2Service = new Http2Service()
// const filesystem = new Filesystem()
// const server = new Server(filesystem, http2Service)

// const streamHandler: StreamHandler = (stream, _headers) => {
//   stream.respond({
//     'content-type': 'text/plain; charset=utf-8',
//     ':status': 200
//   })
//   stream.end('Hello, World!')
// }

// const errorHandler: ErrorHandler = (error) => console.log(error)

// server.run(
//   port,
//   streamHandler,
//   errorHandler,
//   process.env.SSL_PRIVATE_KEY_FILEPATH as string,
//   process.env.SSL_CERTIFICATE_FILEPATH as string,
// )