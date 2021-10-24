import artistCreateAction from '../actions/artistCreateAction.js'
import artistIndexAction from '../actions/artistIndexAction.js'
import artistShowAction from '../actions/artistShowAction.js'
import artistUpdateAction from '../actions/artistUpdateAction.js'
import trackCreateAction from '../actions/trackCreateAction.js'
import trackIndexAction from '../actions/trackIndexAction.js'
import trackShowAction from '../actions/trackShowAction.js'
import trackUpdateAction from '../actions/trackUpdateAction.js'
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
    method: 'PUT',
    path: /^\/artists\/([1-9]\d*)\/?$/,
    action: artistUpdateAction,
  },
  {
    method: 'POST',
    path: /^\/tracks\/?$/,
    action: trackCreateAction,
  },
  {
    method: 'GET',
    path: /^\/tracks\/?$/,
    action: trackIndexAction,
  },
  {
    method: 'GET',
    path: /^\/tracks\/([1-9]\d*)\/?$/,
    action: trackShowAction,
  },
  {
    method: 'PUT',
    path: /^\/tracks\/([1-9]\d*)\/?$/,
    action: trackUpdateAction,
  },
]

export default routes