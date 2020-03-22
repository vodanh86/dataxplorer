import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

export const LOGIN_REQUEST = '@@jwt/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@jwt/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@jwt/LOGIN_FAILURE';

export const LOGOUT_REQUEST = '@@jwt/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = '@@jwt/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = '@@jwt/LOGOUT_FAILURE';

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

export const login = (username, password) => ({
    [RSAA]: {
        endpoint: process.env.REACT_APP_SSO_URL + '/api/auth/token/obtain/',
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
        ]
      }
})

export const refreshAccessToken = (token) => ({
    [RSAA]: {
        endpoint: '/api/auth/token/refresh/',
        method: 'POST',
        body: JSON.stringify({refresh: token}),
        headers: { 'Content-Type': 'application/json' },
        types: [
          TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
        ]
    }
})

export const updateToken = (user, code) => ({
    [RSAA]: {
        endpoint: '/api/user/updateToken/',
        method: 'POST',
        body: JSON.stringify({user: user, code: code}),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            UPDATE_TOKEN_REQUEST, UPDATE_TOKEN_RECEIVED, UPDATE_TOKEN_FAILURE           
        ]
    }
  })

  export const refreshToken = (user, code) => ({
    [RSAA]: {
        endpoint: '/api/user/refreshToken/',
        method: 'POST',
        body: JSON.stringify({user: user, code: code}),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_RECEIVED, REFRESH_TOKEN_FAILURE             
        ]
    }
  })

export const logout = () => ({
    [RSAA]: {
        types: [
            LOGOUT_SUCCESS
        ]
    }
})
