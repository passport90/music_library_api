import Action from './action'

export default interface Route {
  method: 'DELETE' | 'GET' | 'POST' | 'PUT'
  path: RegExp
  action: Action
}