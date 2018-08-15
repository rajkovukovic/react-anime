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

const icons = [
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo6,
]

const ComplexComponent = ({ iconIndex, backgroundColor, color, label }) => (
  <div
    className='complex-component'
    style={{
      backgroundColor,
      color
    }}
  >
    <p>{label}</p>
    {icons[iconIndex]}
  </div>
)

export default ComplexComponent