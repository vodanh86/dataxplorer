import * as account from '../actions/account'

const initialState = {
  accounts: undefined,
  accountInfo: undefined,
}

export default (state=initialState, action) => {
  switch(action.type) {
    case account.GET_ACCOUNTS_SUCCESS:
      return {
        accounts: action.payload.accounts,
        accountInfo: state.accountInfo
      }
    case account.GET_ACCOUNT_INFO_SUCCESS:
      return {
        accounts: state.accounts,
        accountInfo: action.payload.accountInfo,
      }
    default:
      return state
  }
}

