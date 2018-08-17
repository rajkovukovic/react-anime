import * as React from 'react'
import PropTypes from 'prop-types'

import { AnimatedContent } from './index'
import { getViewportSize } from '../utils/helpers'

class AnimationStage extends React.PureComponent {

  static propTypes = {
    animating: PropTypes.bool.isRequired,
    componentCount: PropTypes.number.isRequired,
    optimized: PropTypes.bool.isRequired,
  }

  state = {
    ...getViewportSize(),
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResizeHandle, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeHandle, true);
  }

  windowResizeHandle = () => {
    this.setState( getViewportSize() )
  }

  render() {
    console.log('Stage.render')
    const { width, height } = this.state
    return (
      <svg
        className='animation-stage'
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`${-width/2 | 0} ${-height/2 | 0} ${width} ${height}`}
        xmlSpace="preserve"
      >
        <g>
          <AnimatedContent {...this.props} {...this.state} />
        </g>
      </svg>
    )
  }
}

export default AnimationStage