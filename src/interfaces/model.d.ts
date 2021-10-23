import StandardObject from './standardObject'

export default interface Model {
  serialize: () => StandardObject
}