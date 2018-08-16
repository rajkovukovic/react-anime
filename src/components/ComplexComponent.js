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
const strokeWidth = 2
const iconX = - iconSize / 2
const iconY = - radius * .7

const ComplexComponent = React.forwardRef((props, ref) => {
  const { iconIndex, backgroundColor, color, label, ...restProps } = props
  const Logo = LOGOS[iconIndex]
  return (
    <g className='complex-component' {...restProps} ref={ref}>
      <circle className='anmated-circle-stroke'cx={0} cy={0} r={radius - strokeWidth} strokeWidth={strokeWidth} fill={'none'} stroke={backgroundColor} />
      <circle className='anmated-circle-progress' cx={0} cy={0} r={radius - strokeWidth} strokeWidth={strokeWidth} fill={'none'} stroke={color} />
      <circle cx={0} cy={0} r={radius * .8} fill={backgroundColor}/>
      <g
        className='svg-logo'
        style={{
          transformOrigin: `${ iconSize / 2 + iconX }px ${ iconSize / 2 + iconY }px`,
        }}
      >
        <Logo
          fill={color}
          transform={`translate(${ iconX } ${ iconY })`}
          style={{
            // transform: `translate(${ iconX } ${ iconY })`,
          }}
        />
      </g>
      <text textAnchor='middle' x={0} y={ radius * .6 } fill={color} fontSize={radius / 4}>
        {label}
      </text>
    </g>
  )
})

export default ComplexComponent