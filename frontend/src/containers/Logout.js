import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import LoginForm from '../components/LoginForm'
import {logout} from  '../actions/auth'
import {authErrors, isAuthenticated} from '../reducers'

const Logout = (props) => {
  props.logout()
  return  <Redirect to='/login' />
  if(props.isAuthenticated) {
     //return  <Redirect to='/' />
  }

  return (
     <div className="login-page">
       <LoginForm {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state)
})

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    logout: () => {
      dispatch(logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
