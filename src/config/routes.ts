import dishIndexAction from '../actions/dishIndexAction.js'
import Route from '../interfaces/route'

const routes: Route[] = [
  {
    method: 'GET',
    path: /^\/dishes\/?$/,
    action: dishIndexAction,
  }
]

export default routes