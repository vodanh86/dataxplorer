import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth, * as fromAuth from './auth.js'
import echo, * as fromEcho from './echo.js'
import config, * as fromConfig from './config.js'
import accounts, * as accountConfig from './account.js'
import marketData, * as fromMarketData from './marketData.js'
import trading, * as fromTrading from './trading.js'

export default combineReducers({
  auth: auth,
  echo: echo,
  config: config,
  accounts: accounts,
  marketData: marketData,
  trading: trading,
  router: routerReducer
})

export const isAuthenticated = state => fromAuth.isAuthenticated(state.auth)
export const accessToken = state => fromAuth.accessToken(state.auth)
export const isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth)
export const refreshToken = state => fromAuth.refreshToken(state.auth)
export const isRefreshTokenExpired = state => fromAuth.isRefreshTokenExpired(state.auth)
export const authErrors = state => fromAuth.errors(state.auth)
export const getUser = state => fromAuth.getUser(state.auth)
export const serverMessage = state => fromEcho.serverMessage(state.echo)

export function withAuth(headers={}) {
  return (state) => ({
    ...headers,
    'Authorization': `Bearer ${accessToken(state)}`
  })
}
