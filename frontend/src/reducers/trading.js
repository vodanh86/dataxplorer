import * as trading from '../actions/trading'

const initialState = {
  orders: undefined,
}

export default (state=initialState, action) => {
  switch(action.type) {
    case trading.PLACE_ORDER_SUCCESS:
      return {
        orders: action.payload.orders,
      }
    default:
      return state
  }
}

