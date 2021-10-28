export default interface AuthenticatorInterface {
  isAuthentic: (authorizationHeader: string) => boolean 
}