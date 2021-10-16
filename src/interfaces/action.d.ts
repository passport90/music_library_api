import Response from './response'

export default interface Action {
  (pathParams: Record<string, string>, queryParams: Record<string, string>, body: Record<string, any> | null): Response
}