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

const ComplexComponent = React.forwardRef((props, ref) => {
  const { iconIndex, backgroundColor, color, label } = props
  const Logo = LOGOS[iconIndex]
  return (
    <span className='complex-component' style={{ backgroundColor, color }} ref={ref}>
      <Logo />
      <p>{label}</p>
    </span>
  )
})

export default ComplexComponent