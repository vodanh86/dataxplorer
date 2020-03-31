import * as trading from '../actions/trading'

const initialState = {
  orders: undefined,
  positions: undefined,
  orderStatus: undefined,
  positionStatus: undefined
}

export default (state=initialState, action) => {
  switch(action.type) {
    case trading.PLACE_ORDER_SUCCESS:
      return {
        ...state,
        orderStatus: action.payload.order_status,
      }
    case trading.EDIT_ORDER_SUCCESS:
      return {
        ...state,
        orderStatus: action.payload.order_status,
      }
    case trading.CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        orderStatus: action.payload.order_status,
      }
    case trading.GET_TRADING_SUCCESS:
      return {
        ...state,
        orders: action.payload.orders,
        positions: action.payload.positions,
      }
    case trading.GET_TRADING_SUCCESS:
      return {
        ...state,
        positionStatus: action.payload.position_status,
      }
    default:
      return state
  }
}

