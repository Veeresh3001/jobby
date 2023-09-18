import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {ImLocation} from 'react-icons/im'

import {BsBoxArrowUpRight, BsBriefcaseFill} from 'react-icons/bs'

import Header from '../Header'
import SimilarJob from '../SimilarJob'

import './index.css'

const jobDetailsApiStatus = {
  initial: 'initial',
  loading: 'loading',
  failure: 'failure',
  succuss: 'succuss',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    skills: [],
    companyLifeDetails: {},
    jobDetailsStatus: jobDetailsApiStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  jobDetailsSuccuss = data => {
    console.log(data)
    const updateJobDetails = {
      id: data.job_details.id,
      location: data.job_details.location,
      rating: data.job_details.rating,
      title: data.job_details.title,
      companyWebsiteUrl: data.job_details.company_website_url,
      packagePerAnnum: data.job_details.package_per_annum,
      companyLogoUrl: data.job_details.company_logo_url,
      employmentType: data.job_details.employment_type,
      jobDescription: data.job_details.job_description,
    }
    const updateSkills = data.job_details.skills.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    }))

    const companyLife = {
      imageUrl: data.job_details.life_at_company.image_url,
      description: data.job_details.life_at_company.description,
    }
    const updateSimilarJobs = data.similar_jobs.map(each => ({
      id: each.id,
      location: each.location,
      rating: each.rating,
      title: each.title,
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      jobDescription: each.job_description,
    }))

    this.setState({
      skills: updateSkills,
      companyLifeDetails: companyLife,
      similarJobs: updateSimilarJobs,
      jobDetails: updateJobDetails,
      jobDetailsStatus: jobDetailsApiStatus.succuss,
    })
  }

  getJobDetails = async () => {
    this.setState({jobDetailsStatus: jobDetailsApiStatus.loading})
    const {match} = this.props
    // console.log(match)
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`

    const jwt = Cookies.get('jwt_token')

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
      this.jobDetailsSuccuss(data)
    } else {
      this.setState({jobDetailsStatus: jobDetailsApiStatus.failure})
    }
  }

  retryJobs = () => this.getJobDetails()

  failJobDetails = () => (
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

  displayJobDetails = () => {
    const {skills, companyLifeDetails, jobDetails, similarJobs} = this.state
    const {
      location,
      rating,
      title,
      packagePerAnnum,
      companyLogoUrl,
      employmentType,
      companyWebsiteUrl,
      jobDescription,
    } = jobDetails
    return (
      <div>
        <div className="job-details">
          <div className="title-card">
            <img src={companyLogoUrl} alt="job details company logo" />
            <div>
              <h1>{title}</h1>
              <p>
                <AiFillStar size="20" color="yellow" /> {rating}
              </p>
            </div>
          </div>
          <div className="package-card">
            <div>
              <p>
                <ImLocation size="20" /> {location}
              </p>
              <p>
                <BsBriefcaseFill size="20" /> {employmentType}
              </p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="visit-card">
            <h1 className="job-item-head">Description</h1>
            <a href={companyWebsiteUrl} target="__blank">
              Visit <BsBoxArrowUpRight size="20" />
            </a>
          </div>
          <p className="job-item-para">{jobDescription}</p>
          <h1 className="skills-head">Skills</h1>
          <ul className="skills-card">
            {skills.map(each => (
              <li key={each.name}>
                <img src={each.imageUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life">Life at Company</h1>
          <div className="life-card">
            <p className="life-para">{companyLifeDetails.description}</p>
            <img src={companyLifeDetails.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="similar-head">Similar Jobs</h1>
        <ul className="similar-card">
          {similarJobs.map(each => (
            <SimilarJob item={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  jobDetailsLoad = () => (
    <div data-testid="loader" className="loading">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSwitch = () => {
    const {jobDetailsStatus} = this.state
    switch (jobDetailsStatus) {
      case jobDetailsApiStatus.loading:
        return this.jobDetailsLoad()
      case jobDetailsApiStatus.failure:
        return this.failJobDetails()
      case jobDetailsApiStatus.succuss:
        return this.displayJobDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="details">
        <Header />
        <div className="details-card">{this.renderSwitch()}</div>
      </div>
    )
  }
}

export default JobItemDetails
