import ArgumentParserInterface from '../interfaces/argumentParserInterface'
import EnvironmentVariableCheckerInterface from '../interfaces/environmentVariableCheckerInterface'

export const REQUIRED_ENVIRONMENT_VARIABLES = [
  'SSL_PRIVATE_KEY_FILEPATH',
  'SSL_CERTIFICATE_FILEPATH',
]

export const DEFAULT_PORT = 443

export default class Application {
  public constructor(
    private environmentVariableChecker: EnvironmentVariableCheckerInterface,
    private argumentParser: ArgumentParserInterface,
  ) { }

  public run = (argv: string[]): void => {
    this.environmentVariableChecker.check(REQUIRED_ENVIRONMENT_VARIABLES)
    const port = this.argumentParser.getPort(argv, DEFAULT_PORT)

    console.log(port)
  } 
}