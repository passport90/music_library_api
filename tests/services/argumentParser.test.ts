import ArgumentParser from '../../src/services/argumentParser'

describe('ArgumentParser', () => {
  let argv: string[]

  beforeEach(() => {
    argv = ['node', 'app.js']
  })

  describe('getPort', () => {
    const invalidPortArguments = ['0', '-1', 'akskd', '1023', '65536']
    const invalidDefaultPortArguments = [0, -1, 1023, 65536]

    it('returns the third process argument as integer', () => {
      argv[2] = '12345'

      const argumentProvider = new ArgumentParser()
      expect(argumentProvider.getPort(argv, 6789)).toBe(12345)
    })

    it('returns default if there is no third process argument', () => {
      argv = argv.slice(0, 2)

      const argumentProvider = new ArgumentParser()
      expect(argumentProvider.getPort(argv, 6789)).toBe(6789)
    })

    it('returns the third process argument as integer even though default is supplied', () => {
      argv[2] = '12345'

      const argumentProvider = new ArgumentParser()
      expect(argumentProvider.getPort(argv, 6789)).toBe(12345)
    })

    it.each(invalidPortArguments)('throws error if third process argument is invalid', (invalidPort) => {
      argv[2] = invalidPort

      const argumentProvider = new ArgumentParser()
      expect(() => argumentProvider.getPort(argv, 6789)).toThrow()
    })

    it.each(
      invalidDefaultPortArguments
    )('throws error if default port is invalid and argument not supplied', (invalidDefaultPort) => {
      argv = process.argv.slice(0, 2)

      const argumentProvider = new ArgumentParser()
      expect(() => argumentProvider.getPort(argv, invalidDefaultPort)).toThrow()
    })
  })
})