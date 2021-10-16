import Application from './services/application.js'
import ArgumentParser from './services/argumentParser.js'
import EnvironmentVariableChecker from './services/environmentVariableChecker.js'
import ErrorHandlerService from './services/errorHandlerService.js'
import Filesystem from './services/node/filesystem.js'
import Http2Service from './services/node/http2Service.js'
import Server from './services/server.js'
import StreamHandlerService from './services/streamHandlerService.js'

// Setup dependencies
const environmentVariableChecker = new EnvironmentVariableChecker()
const argumentParser = new ArgumentParser()

const errorHandlerService = new ErrorHandlerService()
const streamHandlerService = new StreamHandlerService()

const filesystem = new Filesystem()
const http2Service = new Http2Service()
const server = new Server(filesystem, http2Service)

const application = new Application(
  environmentVariableChecker,
  argumentParser,
  streamHandlerService,
  errorHandlerService,
  server,
)

// Run Application
application.run(process.argv)