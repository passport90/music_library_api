import artistIndexAction from '../actions/artistIndexAction.js'
import Route from '../interfaces/route'

const routes: Route[] = [
  {
    method: 'GET',
    path: /^\/artists\/?$/,
    action: artistIndexAction,
  }
]

export default routes