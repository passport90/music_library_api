import ArgumentParserInterface from '../interfaces/argumentParserInterface'
import EnvironmentVariableCheckerInterface from '../interfaces/environmentVariableCheckerInterface'
import ErrorHandlerServiceInterface from '../interfaces/errorHandlerServiceInterface'
import ServerInterface from '../interfaces/serverInterface'
import StreamHandlerServiceInterface from '../interfaces/streamHandlerServiceInterface'

export const REQUIRED_ENVIRONMENT_VARIABLES = [
  'SSL_PRIVATE_KEY_FILEPATH',
  'SSL_CERTIFICATE_FILEPATH',
]

export const DEFAULT_PORT = 8443

export default class Application {
  public constructor(
    private environmentVariableChecker: EnvironmentVariableCheckerInterface,
    private argumentParser: ArgumentParserInterface,
    private streamHandlerService: StreamHandlerServiceInterface,
    private errorHandlerService: ErrorHandlerServiceInterface,
    private server: ServerInterface,
  ) { }

  public run = (argv: string[]): void => {
    this.environmentVariableChecker.check(REQUIRED_ENVIRONMENT_VARIABLES)
    const port = this.argumentParser.getPort(argv, DEFAULT_PORT)

    this.server.run(
      port,
      this.streamHandlerService.handle,
      this.errorHandlerService.handle,
      process.env.SSL_PRIVATE_KEY_FILEPATH as string,
      process.env.SSL_CERTIFICATE_FILEPATH as string,
    )
  } 
}