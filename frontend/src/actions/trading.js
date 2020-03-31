import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

require('dotenv').config();

export const PLACE_ORDER_REQUEST = '@@trading/PLACE_ORDER_REQUEST';
export const PLACE_ORDER_SUCCESS = '@@trading/PLACE_ORDER_SUCCESS';
export const PLACE_ORDER_FAILURE = '@@trading/PLACE_ORDER_FAILURE';

export const EDIT_ORDER_REQUEST = '@@trading/EDIT_ORDER_REQUEST';
export const EDIT_ORDER_SUCCESS = '@@trading/EDIT_ORDER_SUCCESS';
export const EDIT_ORDER_FAILURE = '@@trading/EDIT_ORDER_FAILURE';

export const CANCEL_ORDER_REQUEST = '@@trading/CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = '@@trading/CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = '@@trading/CANCEL_ORDER_FAILURE';

export const GET_TRADING_REQUEST = '@@trading/GET_TRADING_REQUEST';
export const GET_TRADING_SUCCESS = '@@trading/GET_TRADING_SUCCESS';
export const GET_TRADING_FAILURE = '@@trading/GET_TRADING_FAILURE';

export const CLOSE_POSITION_REQUEST = '@@trading/CLOSE_POSITION_REQUEST';
export const CLOSE_POSITION_SUCCESS = '@@trading/CLOSE_POSITION_SUCCESS';
export const CLOSE_POSITION_FAILURE = '@@trading/CLOSE_POSITION_FAILURE';

export const placeOrder = (user, order, callback) => ({
  [RSAA]: {
      endpoint: '/api/trading/placeOrder/',
      method: 'POST',
      body: JSON.stringify({user: user, order: order}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        PLACE_ORDER_REQUEST, 
        {
          type: PLACE_ORDER_SUCCESS,
          payload: (action, state, res) => {
              return res.json().then((data) => {
                 callback(data); // <== call second action here
                 return data; // <== payload for the SUCCESS action
              });
            }
        },
        PLACE_ORDER_FAILURE
      ]
  }
})

export const editOrder = (user, order, callback) => ({
  [RSAA]: {
      endpoint: '/api/trading/editOrder/',
      method: 'POST',
      body: JSON.stringify({user: user, order: order}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        EDIT_ORDER_REQUEST, 
        {
          type: EDIT_ORDER_SUCCESS,
          payload: (action, state, res) => {
              return res.json().then((data) => {
                 callback(data); // <== call second action here
                 return data; // <== payload for the SUCCESS action
              });
            }
        },
        EDIT_ORDER_FAILURE
      ]
  }
})

export const cancelOrder = (user, accountId, orderId, callback) => ({
  [RSAA]: {
      endpoint: '/api/trading/cancelOrder/',
      method: 'POST',
      body: JSON.stringify({user: user, accountId: accountId, orderId: orderId}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        CANCEL_ORDER_REQUEST, 
        {
          type: CANCEL_ORDER_SUCCESS,
          payload: (action, state, res) => {
              return res.json().then((data) => {
                 callback(data); // <== call second action here
                 return data; // <== payload for the SUCCESS action
              });
            }
        },
        CANCEL_ORDER_FAILURE
      ]
  }
})

export const closePosition = (user, accountId, positionId, callback) => ({
  [RSAA]: {
      endpoint: '/api/trading/closePosition/',
      method: 'POST',
      body: JSON.stringify({user: user, accountId: accountId, positionId: positionId}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        CLOSE_POSITION_REQUEST, 
        {
          type: CLOSE_POSITION_SUCCESS,
          payload: (action, state, res) => {
              return res.json().then((data) => {
                 callback(data); // <== call second action here
                 return data; // <== payload for the SUCCESS action
              });
            }
        },
        CLOSE_POSITION_FAILURE
      ]
  }
})

export const getTradingInfor = (user, accountId) => ({
  [RSAA]: {
      endpoint: '/api/trading/getTradingInfor/',
      method: 'POST',
      body: JSON.stringify({user: user, accountId: accountId}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_TRADING_REQUEST, GET_TRADING_SUCCESS, GET_TRADING_FAILURE
      ]
  }
})

