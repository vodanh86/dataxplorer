import jwtDecode from 'jwt-decode'
import * as auth from '../actions/auth'


const initialState = {
  access: undefined,
  refresh: undefined,
  user: undefined,
  errors: {},
}

export default (state=initialState, action) => {
  switch(action.type) {
    case auth.LOGIN_SUCCESS:
      return {
        access: {
          token: action.payload.access,
          ...jwtDecode(action.payload.access)
        },
        refresh: {
          token: action.payload.refresh,
          ...jwtDecode(action.payload.refresh)
        },
        user: action.payload.user,
        errors: {}
    }
    case auth.TOKEN_RECEIVED:
      return {
        ...state,
        access: {
          token: action.payload.access,
          ...jwtDecode(action.payload.access)
        }
      }
    case auth.LOGOUT_SUCCESS:
      return {
        access: undefined,
        refresh: undefined,
        user: undefined,
        errors: {}
      }
    case auth.LOGIN_FAILURE:
    case auth.TOKEN_FAILURE:
      return {
         access: undefined,
         refresh: undefined,
         user: undefined,
         errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
    case auth.UPDATE_TOKEN_RECEIVED:
      return {
        user: action.payload.user
      }
    case auth.CHECK_TOKEN_RECEIVED:
        return {
         ...state,
         user: action.payload.user
        }
    case auth.REFRESH_TOKEN_RECEIVED:
      return {
        user: action.payload.user
      }
    default:
      return state
    }
}

export function accessToken(state) {
  if (state.access) {
    return  state.access.token
  }
}

export function isAccessTokenExpired(state) {
  if (state.access && state.access.exp) {
    return 1000 * state.access.exp - (new Date()).getTime() < 5000
  }
  return true
}

export function refreshToken(state) {
  if (state.refresh) {
    return  state.refresh.token
  }
}

export function getUser(state) {
  return state.user
}

export function isRefreshTokenExpired(state) {
  if (state.refresh && state.refresh.exp) {
    return 1000 * state.refresh.exp - (new Date()).getTime() < 5000
  }
  return true
}

export function isAuthenticated(state) {
  return (typeof state.refresh !== 'undefined') && !isRefreshTokenExpired(state)
}

export function errors(state) {
  return  state.errors
}
