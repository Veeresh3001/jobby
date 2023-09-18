import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const jwt = Cookies.get('jwt_token')
    console.log(jwt)
    const {history} = props
    // console.log("logout")
    history.replace('/login')
    Cookies.remove('jwt_token')
  }

  return (
    <div className="header">
      <ul className="header-items">
        <li>
          <Link to="/">
            <img
              className="header-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li className="home-link-card">
          <Link className="header-item" to="/">
            <h1 className="head">Home</h1>
          </Link>
          <Link className="header-item" to="/jobs">
            <h1 className="head">Jobs</h1>
          </Link>
        </li>
        <li>
          <button className="logout-btn" type="button" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
