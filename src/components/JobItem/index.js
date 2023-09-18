import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {ImLocation} from 'react-icons/im'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {item} = props
  // console.log(item)
  const {
    id,
    location,
    rating,
    title,
    packagePerAnnum,
    companyLogoUrl,
    employmentType,
    jobDescription,
  } = item

  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="job-item">
        <div className="title-card">
          <img src={companyLogoUrl} alt="company logo" />
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
        <h1 className="job-item-head">Description</h1>
        <p className="job-item-para">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
