import jwt from 'jsonwebtoken'
import AuthenticatorInterface from '../interfaces/authenticatorInterface'

export default class Authenticator implements AuthenticatorInterface {
  public isAuthentic = (authorizationHeader: string): boolean => {
    const [authorizationMethod, token] = authorizationHeader.split(' ')
    if (authorizationMethod !== 'Bearer') {
      return false
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string)
    } catch (_error) {
      return false
    }

    return true
  }
}