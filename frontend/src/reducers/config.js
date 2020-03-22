import * as config from '../actions/config'

const initialState = {
  config: undefined,
  mapping: undefined,
}

export default (state=initialState, action) => {
  switch(action.type) {
    case config.CONFIG_SUCCESS:
      return {
        config: action.payload.config,
        mapping: action.payload.mapping
      }
    default:
      return state
  }
}

