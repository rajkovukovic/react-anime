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

const radius = 24
const iconSize = 24

const ComplexComponent = React.forwardRef((props, ref) => {
  const { iconIndex, backgroundColor, color, label, ...restProps } = props
  const Logo = LOGOS[iconIndex]
  return (
    <g className='complex-component' {...restProps} ref={ref}>
      <circle cx={0} cy={0} r={radius} fill={backgroundColor}/>
      <Logo fill={color} transform={`translate(${ - iconSize / 2 } ${ -radius * .8 })`}/>
      <text textAnchor='middle' x={0} y={ radius * .6 } fill={color} fontSize={radius / 3}>
        {label}
      </text>
    </g>
  )
})

export default ComplexComponent