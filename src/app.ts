import pg from 'pg'
import routes from './config/routes.js'
import Application from './services/application.js'
import ArgumentParser from './services/argumentParser.js'
import Authenticator from './services/authenticator.js'
import EnvironmentVariableChecker from './services/environmentVariableChecker.js'
import ExceptionResponseFactory from './services/exceptionResponseFactory.js'
import HeaderValidator from './services/headerValidator.js'
import Filesystem from './services/node/filesystem.js'
import Http2Service from './services/node/http2Service.js'
import RequestBodyParser from './services/requestBodyParser.js'
import Responder from './services/responder.js'
import Router from './services/router.js'
import Server from './services/server.js'
import StreamHandlerService from './services/streamHandlerService.js'

// Setup dependencies
const environmentVariableChecker = new EnvironmentVariableChecker()
const argumentParser = new ArgumentParser()

const headerValidator = new HeaderValidator()
const authenticator = new Authenticator()
const exceptionResponseFactory = new ExceptionResponseFactory()
const responder = new Responder()
const router = new Router(routes)
const requestBodyParser = new RequestBodyParser()
const pgClient = new pg.Client({ connectionString: process.env.DATABASE_URL})
const streamHandlerService = new StreamHandlerService(
  headerValidator,
  authenticator,
  exceptionResponseFactory,
  responder,
  router,
  requestBodyParser,
  pgClient,
)

const filesystem = new Filesystem()
const http2Service = new Http2Service()
const server = new Server(filesystem, http2Service)

const application = new Application(
  environmentVariableChecker,
  argumentParser,
  pgClient,
  streamHandlerService,
  server,
)

// Run Application
application.run(process.argv)