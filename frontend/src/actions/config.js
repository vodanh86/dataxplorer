import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

require('dotenv').config();

export const CONFIG_REQUEST = '@@config/CONFIG_REQUEST';
export const CONFIG_SUCCESS = '@@config/CONFIG_SUCCESS';
export const CONFIG_FAILURE = '@@config/CONFIG_FAILURE';

export const MAPPING_REQUEST = '@@config/MAPPING_REQUEST';
export const MAPPING_SUCCESS = '@@config/MAPPING_SUCCESS';
export const MAPPING_FAILURE = '@@config/MAPPING_FAILURE';

export const getConfig = (user) => ({
  [RSAA]: {
      endpoint: '/api/config/getConfig/',
      method: 'POST',
      body: JSON.stringify({user: user}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        CONFIG_REQUEST, CONFIG_SUCCESS, CONFIG_FAILURE
      ]
  }
})

export const getMapping = (user) => ({
  [RSAA]: {
      endpoint: '/api/config/getMapping/',
      method: 'POST',
      body: JSON.stringify({user: user}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        MAPPING_REQUEST, MAPPING_SUCCESS, MAPPING_FAILURE
      ]
  }
})

