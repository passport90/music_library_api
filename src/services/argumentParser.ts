export default class ArgumentParser {
  public getPort = (argv: string[], defaultPort: number): number => {
    const port = argv.length >= 3 ? parseInt(argv[2]) : defaultPort

    if (!(1 << 10 <= port && port < 1 << 16)) {
      throw new Error(`Invalid server port number: ${argv[2] ?? defaultPort}`)
    }

    return port
  }
}