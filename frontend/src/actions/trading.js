import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

require('dotenv').config();

export const PLACE_ORDER_REQUEST = '@@trading/PLACE_ORDER_REQUEST';
export const PLACE_ORDER_SUCCESS = '@@trading/PLACE_ORDER_SUCCESS';
export const PLACE_ORDER_FAILURE = '@@trading/PLACE_ORDER_FAILURE';
export const PLACE_ORDER_UPDATE = '@@trading/PLACE_ORDER_UPDATE';


export const placeOrder = (user, order) => ({
  [RSAA]: {
      endpoint: '/api/trading/placeOrder/',
      method: 'POST',
      body: JSON.stringify({user: user, order: order}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        PLACE_ORDER_REQUEST, PLACE_ORDER_SUCCESS, PLACE_ORDER_FAILURE
      ]
  }
})

