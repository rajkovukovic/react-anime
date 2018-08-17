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

const nodeRadius = 24
const iconSize = 24
const strokeWidth = 2
const iconX = - iconSize / 2
const iconY = - nodeRadius * .7

const ComplexComponent = React.forwardRef((props, ref) => {
  const { iconIndex, backgroundColor, color, label, index, ...restProps } = props
  const Logo = LOGOS[iconIndex]
  return (
    <g className='complex-component' {...restProps} ref={ref}>
      <g className='node-spin'>
        <circle className='animated-circle-stroke'cx={0} cy={0} r={nodeRadius - strokeWidth} strokeWidth={strokeWidth} fill={'none'} stroke={backgroundColor} />
        <circle className='animated-circle-progress' cx={0} cy={0} r={nodeRadius - strokeWidth} strokeWidth={strokeWidth} fill={'none'} stroke={color} />
      </g>
      <circle cx={0} cy={0} r={nodeRadius * .8} fill={backgroundColor}/>
      <g
        className='node-logo'
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
      <text textAnchor='middle' x={0} y={ nodeRadius * .6 } fill={color} fontSize={nodeRadius / 4}>
        {`${index} - ${label}`}
      </text>
    </g>
  )
})

export default ComplexComponent