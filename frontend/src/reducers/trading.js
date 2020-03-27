import * as trading from '../actions/trading'

const initialState = {
  orders: undefined,
  orderStatus: undefined
}

export default (state=initialState, action) => {
  switch(action.type) {
    case trading.PLACE_ORDER_SUCCESS:
      return {
        orders: state.orders,
        orderStatus: action.payload.order_status,
      }
    case trading.CANCEL_ORDER_SUCCESS:
      return {
        orders: state.orders,
        orderStatus: action.payload.order_status,
      }
    case trading.GET_TRADING_SUCCESS:
      return {
        orders: action.payload.orders,
      }
    default:
      return state
  }
}

