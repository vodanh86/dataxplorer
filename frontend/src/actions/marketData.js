import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

require('dotenv').config();

export const QUOTES_REQUEST = '@@market/QUOTES_REQUEST';
export const QUOTES_SUCCESS = '@@market/QUOTES_SUCCESS';
export const QUOTES_FAILURE = '@@market/QUOTES_FAILURE';
export const QUOTES_UPDATE = '@@market/QUOTES_UPDATE';

export const getQuotes = (user, symbol) => ({
  [RSAA]: {
      endpoint: '/api/marketData/getMarketData/',
      method: 'POST',
      body: JSON.stringify({user: user, symbol: symbol}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        QUOTES_REQUEST, QUOTES_SUCCESS, QUOTES_FAILURE
      ]
  }
})
