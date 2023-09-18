import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobsApiStatus = {
  initial: 'initial',
  loading: 'loading',
  failure: 'failure',
  succuss: 'succuss',
}

const profileApiStatus = {
  initial: 'initial',
  loading: 'loading',
  failure: 'failure',
  succuss: 'succuss',
}

class Jobs extends Component {
  state = {
    profileDetail: {},
    profileStatus: profileApiStatus.initial,
    jobsList: [],
    jobsStatus: jobsApiStatus.initial,
    serachInput: '',
    salaryRange: '',
    employmentTypes: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  jobsApiSuccuss = data => {
    const updatedJobsData = data.map(each => ({
      id: each.id,
      location: each.location,
      rating: each.rating,
      title: each.title,
      packagePerAnnum: each.package_per_annum,
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      jobDescription: each.job_description,
    }))
    // console.log(updatedJobsData)
    this.setState({
      jobsList: updatedJobsData,
      jobsStatus: jobsApiStatus.succuss,
    })
  }

  getJobsDetails = async () => {
    this.setState({jobsStatus: jobsApiStatus.loading})
    const jwt = Cookies.get('jwt_token')

    const {serachInput, salaryRange, employmentTypes} = this.state

    const joinEmployee = employmentTypes.join(',')
    // console.log(joinEmployee)

    const url = `https://apis.ccbp.in/jobs?employment_type=${joinEmployee}&minimum_package=${salaryRange}&search=${serachInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    // console.log(data)
    if (response.ok === true) {
      this.jobsApiSuccuss(data.jobs)
    } else {
      this.setState({jobsStatus: jobsApiStatus.failure})
    }
  }

  profileDetailSuccuss = profile => {
    const updateProfile = {
      name: profile.name,
      profileImageUrl: profile.profile_image_url,
      shortBio: profile.short_bio,
    }

    this.setState({
      profileDetail: updateProfile,
      profileStatus: profileApiStatus.succuss,
    })
  }

  getProfileDetails = async () => {
    this.setState({profileStatus: profileApiStatus.loading})
    const jwt = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    // console.log(data)
    if (response.ok === true) {
      this.profileDetailSuccuss(data.profile_details)
    } else {
      this.setState({profileStatus: profileApiStatus.failure})
    }
  }

  displayProfileLoad = () => (
    <div data-testid="loader" className="loading">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayProfile = () => {
    const {profileDetail} = this.state
    return (
      <div className="profile-card">
        <img src={profileDetail.profileImageUrl} alt="profile" />
        <h1>{profileDetail.name}</h1>
        <p>{profileDetail.shortBio}</p>
      </div>
    )
  }

  retryProfile = () => this.getProfileDetails()

  displayProfileFail = () => (
    <div className="profile-fail">
      <button className="retry" type="button" onClick={this.retryProfile}>
        Retry
      </button>
    </div>
  )

  renderSwitchProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileApiStatus.loading:
        return this.displayProfileLoad()
      case profileApiStatus.failure:
        return this.displayProfileFail()
      case profileApiStatus.succuss:
        return this.displayProfile()
      default:
        return null
    }
  }

  retryJobs = () => this.getJobsDetails()

  displayJobsFail = () => (
    <div className="jobs-fail">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.retryJobs} type="button" className="retry">
        Retry
      </button>
    </div>
  )

  noJobsFound = () => (
    <div className="jobs-fail">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-jobs-img"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  displayJobsSuccuss = () => {
    const {jobsList} = this.state
    // console.log(jobsList)
    if (jobsList.length <= 0) {
      return this.noJobsFound()
    }
    return (
      <ul className="jobs-items-card">
        {jobsList.map(each => (
          <JobItem item={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderSwitchJobs = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case jobsApiStatus.loading:
        return this.displayProfileLoad()
      case jobsApiStatus.failure:
        return this.displayJobsFail()
      case jobsApiStatus.succuss:
        return this.displayJobsSuccuss()
      default:
        return null
    }
  }

  onChangeSalary = event => {
    // console.log(event.target.value)
    this.setState({salaryRange: event.target.value}, this.getJobsDetails)
  }

  onClickEmployType = event => {
    const {employmentTypes} = this.state
    if (event.target.checked) {
      // console.log(event.target.value)
      this.setState(
        prev => ({
          employmentTypes: [...prev.employmentTypes, event.target.value],
        }),
        this.getJobsDetails,
      )
    } else {
      const update = employmentTypes.filter(each => each !== event.target.value)
      this.setState({employmentTypes: update}, this.getJobsDetails)
    }
  }

  onChangeSearchInput = event => {
    // console.log(event.target.value)
    this.setState({serachInput: event.target.value})
  }

  onClickSearchIcon = () => this.getJobsDetails()

  render() {
    const {serachInput} = this.state

    return (
      <div className="jobs">
        <Header />
        <div className="jobs-main">
          <div className="filter">
            <div className="profile">{this.renderSwitchProfile()}</div>
            <hr />
            <h1 className="filter-head">Type of Employment</h1>
            <ul className="filter-list">
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    className="check"
                    onChange={this.onClickEmployType}
                    id={each.employmentTypeId}
                    type="checkbox"
                    value={each.employmentTypeId}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="filter-head">Salary Range</h1>
            <ul className="filter-list" onChange={this.onChangeSalary}>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    className="check"
                    id={each.salaryRangeId}
                    type="radio"
                    value={each.salaryRangeId}
                    name="salary"
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-card">
            <div className="search-card">
              <input
                value={serachInput}
                onChange={this.onChangeSearchInput}
                className="search"
                type="search"
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch className="search-icon" size="20" />
              </button>
            </div>
            <div className="jobs-items">{this.renderSwitchJobs()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
