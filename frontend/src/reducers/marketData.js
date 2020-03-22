import * as marketData from '../actions/marketData'

const initialState = {
  quotes: undefined,
  depth: undefined
}

export default (state=initialState, action) => {
  switch(action.type) {
    case marketData.QUOTES_SUCCESS:
      return {
        quotes: action.payload.quotes,
        depth: action.payload.depth
      }
    default:
      return state
  }
}


export function getMarketData(state) {
  return state.user
}

export const serverMessage = (state) => state.message
