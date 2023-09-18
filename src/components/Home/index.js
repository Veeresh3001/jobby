import {Component} from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <Header />
        <div className="home-card">
          <h1 className="home-head">Find The Job That Fits Your Life</h1>
          <p className="home-para">
            Millions of people are searching for jobs, salary
            <br />
            information, company reviews. Find the job that you fits your
            <br />
            abilities and potential.
          </p>
          <button className="find-btn" type="button">
            <Link to="/jobs" className="btn-link">
              Find Jobs
            </Link>
          </button>
        </div>
      </div>
    )
  }
}

export default Home
