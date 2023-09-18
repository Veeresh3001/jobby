import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isFailure: false,
    errMsg: '',
  }

  loginFailed = errMsg => {
    this.setState({isFailure: true, errMsg})
  }

  loginSuccuss = jwtToken => {
    // console.log(jwtToken)
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}
    // console.log(userDetails)
    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.loginSuccuss(data.jwt_token)
    } else {
      this.loginFailed(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, isFailure, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login">
        <div className="login-card">
          <img
            className="login-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="form-card" onSubmit={this.onSubmitForm}>
            <label htmlFor="user" className="form-label">
              USERNAME
            </label>
            <input
              id="user"
              value={username}
              className="form-input"
              type="text"
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="pass" className="form-label">
              PASSWORD
            </label>
            <input
              placeholder="Password"
              onChange={this.onChangePassword}
              value={password}
              id="pass"
              className="form-input"
              type="password"
            />
            <button type="submit" className="login-btn">
              Login
            </button>
            {isFailure && <p className="err">{`*${errMsg}`}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
