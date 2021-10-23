import artistCreateAction from '../actions/artistCreateAction.js'
import artistIndexAction from '../actions/artistIndexAction.js'
import artistShowAction from '../actions/artistShowAction.js'
import trackCreateAction from '../actions/trackCreateAction.js'
import trackShowAction from '../actions/trackShowAction.js'
import Route from '../interfaces/route'

const routes: Route[] = [
  {
    method: 'POST',
    path: /^\/artists\/?$/,
    action: artistCreateAction,
  },
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
  {
    method: 'POST',
    path: /^\/tracks\/?$/,
    action: trackCreateAction,
  },
  {
    method: 'GET',
    path: /^\/tracks\/([1-9]\d*)\/?$/,
    action: trackShowAction,
  },
]

export default routes