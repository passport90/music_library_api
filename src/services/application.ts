import EnvironmentVariableCheckerInterface from '../interfaces/environmentVariableCheckerInterface'

export const REQUIRED_ENVIRONMENT_VARIABLES = [
  'SSL_PRIVATE_KEY_FILEPATH',
  'SSL_CERTIFICATE_FILEPATH',
]

export default class Application {
  public constructor(private environmentVariableChecker: EnvironmentVariableCheckerInterface) {}

  public run = (_argv: string[]): void => {
    this.environmentVariableChecker.check(REQUIRED_ENVIRONMENT_VARIABLES)
  } 
}