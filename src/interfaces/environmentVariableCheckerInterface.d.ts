export default interface EnvironmentVariableCheckerInterface {
  check: (environmentVariableNames: string[]) => void 
}