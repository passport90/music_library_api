export default interface Model {
  serialize: () => Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}