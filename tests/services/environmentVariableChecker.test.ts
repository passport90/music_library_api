import EnvironmentVariableChecker from '../../src/services/environmentVariableChecker'

describe('EnvironmentVariableChecker', () => {
  describe('check', () => {
    let originalEnv: NodeJS.ProcessEnv

    const requiredEnvironmentVariables = [
      'VARIABLE_A',
      'VARIABLE_B',
      'VARIABLE_C',
    ]

    beforeEach(() => {
      jest.resetModules()
      originalEnv = { ...process.env }
    })

    afterEach(() => {
      process.env = { ...originalEnv }
    })

    it('checks whether all required environment variables have been defined', () => {
      process.env.VARIABLE_A = 'a'
      process.env.VARIABLE_B = 'b'
      process.env.VARIABLE_C = 'c'

      const environmentVariableChecker = new EnvironmentVariableChecker()
      expect(() => environmentVariableChecker.check(requiredEnvironmentVariables)).not.toThrow()
    })

    it('throws error if one of the required variables does not exist', () => {
      process.env.VARIABLE_A = 'a'
      process.env.VARIABLE_C = 'c'

      const environmentVariableChecker = new EnvironmentVariableChecker()
      expect(() => environmentVariableChecker.check(requiredEnvironmentVariables)).toThrow()
    })
  })
})