import EnvironmentVariableCheckerInterface from '../interfaces/environmentVariableCheckerInterface'

export default class EnvironmentVariableChecker implements EnvironmentVariableCheckerInterface {
  public check = (environmentVariableNames: string[]): void => {
    for (const environmentVariableName of environmentVariableNames) {
      if (!(environmentVariableName in process.env)) {
        throw new Error(`An environment variable has not been defined yet: ${environmentVariableName}`)
      }
    }
  }
} 