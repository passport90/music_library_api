import pg from 'pg'
import ArgumentParserInterface from '../interfaces/argumentParserInterface'
import EnvironmentVariableCheckerInterface from '../interfaces/environmentVariableCheckerInterface'
import ServerInterface from '../interfaces/serverInterface'
import StreamHandlerServiceInterface from '../interfaces/streamHandlerServiceInterface'

export const REQUIRED_ENVIRONMENT_VARIABLES = [
  'AUTH_USERNAME',
  'AUTH_PASSWORD',
  'DATABASE_URL',
  'JWT_SECRET',
  'SSL_PRIVATE_KEY_FILEPATH',
  'SSL_CERTIFICATE_FILEPATH',
  'TZ',
  'WEB_UI_HOST',
]

export const DEFAULT_PORT = 8443

export default class Application {
  public constructor(
    private environmentVariableChecker: EnvironmentVariableCheckerInterface,
    private argumentParser: ArgumentParserInterface,
    private pgClient: pg.Client,
    private streamHandlerService: StreamHandlerServiceInterface,
    private server: ServerInterface,
  ) { }

  public run = (argv: string[]): void => {
    this.environmentVariableChecker.check(REQUIRED_ENVIRONMENT_VARIABLES)
    const port = this.argumentParser.getPort(argv, DEFAULT_PORT)
    this.pgClient.connect()

    this.server.serve(
      port,
      this.streamHandlerService.handle,
      process.env.SSL_PRIVATE_KEY_FILEPATH as string,
      process.env.SSL_CERTIFICATE_FILEPATH as string,
    )
  } 
}