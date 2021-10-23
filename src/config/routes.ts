import artistIndexAction from '../actions/artistIndexAction.js'
import artistShowAction from '../actions/artistShowAction.js'
import Route from '../interfaces/route'

const routes: Route[] = [
  {
    method: 'GET',
    path: /^\/artists\/?$/,
    action: artistIndexAction,
  },
  {
    method: 'GET',
    path: /^\/artists\/([1-9]\d*)\/?$/,
    action: artistShowAction,
  },
]

export default routes