import * as React from 'react'
import './ComplexComponent.css'

import {
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo6,
} from './Logos'

const LOGOS = [
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo6,
]

class ComplexComponent extends React.Component {
  render () {
    const { iconIndex, backgroundColor, color, label } = this.props
    const Icon = LOGOS[iconIndex]
    return (
      <div className='complex-component' style={{ backgroundColor, color }} >
        <p>{label}</p>
        {/* <Logo /> */}
        <Logo1 />
      </div>
    )
  }
}

export default ComplexComponent