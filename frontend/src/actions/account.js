import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

export const GET_ACCOUNTS_REQUEST = '@@account/GET_ACCOUNTS_REQUEST';
export const GET_ACCOUNTS_SUCCESS = '@@account/GET_ACCOUNTS_SUCCESS';
export const GET_ACCOUNTS_FAILURE = '@@account/GET_ACCOUNTS_FAILURE';

export const GET_ACCOUNT_INFO_REQUEST = '@@account/GET_ACCOUNT_INFO_REQUEST';
export const GET_ACCOUNT_INFO_SUCCESS = '@@account/GET_ACCOUNT_INFO_SUCCESS';
export const GET_ACCOUNT_INFO_FAILURE = '@@account/GET_ACCOUNT_INFO_FAILURE';

export const TOKEN_REQUEST = '@@jwt/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@jwt/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@jwt/TOKEN_FAILURE';

export const UPDATE_TOKEN_REQUEST = '@@jwt/UPDATE_TOKEN_REQUEST';
export const UPDATE_TOKEN_RECEIVED = '@@jwt/UPDATE_TOKEN_RECEIVED';
export const UPDATE_TOKEN_FAILURE = '@@jwt/UPDATE_TOKEN_FAILURE';

export const REFRESH_TOKEN_REQUEST = '@@jwt/REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_RECEIVED = '@@jwt/REFRESH_TOKEN_RECEIVED';
export const REFRESH_TOKEN_FAILURE = '@@jwt/REFRESH_TOKEN_FAILURE';


require('dotenv').config();

export const getAccounts = (user) => ({
    [RSAA]: {
        endpoint: process.env.REACT_APP_SSO_URL + '/api/account/getAccounts/',
        method: 'POST',
        body: JSON.stringify({user: user}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            GET_ACCOUNTS_REQUEST, GET_ACCOUNTS_SUCCESS, GET_ACCOUNTS_FAILURE
        ]
      }
})

export const getAccountInfo = (user, accountId, instrumentId) => ({
    [RSAA]: {
        endpoint: process.env.REACT_APP_SSO_URL + '/api/account/getAccountInfo/',
        method: 'POST',
        body: JSON.stringify({user: user, accountId: accountId, instrumentId: instrumentId}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            GET_ACCOUNT_INFO_REQUEST, GET_ACCOUNT_INFO_SUCCESS, GET_ACCOUNT_INFO_FAILURE
        ]
      }
})