import * as React from 'react'

import { AnimatedComponent, ComplexComponent } from './index'

import { randomRange, tickPhysics } from '../utils/helpers'

const scaleFactor = 3
const defaultPhysics = JSON.stringify({
  animatedProps: {
    x: {
      value: 0,
      velocity: 0,
      maxVelocity: 200,
      maxAcc: 3,
      min: -100,
      max: 100,
    },
    y: {
      value: 0,
      velocity: 0,
      maxVelocity: 200,
      maxAcc: 3,
      min: -100,
      max: 100,
    },
    scale: {
      value: 1 * scaleFactor,
      velocity: 0,
      maxVelocity: 0.5,
      maxAcc: 0.1,
      min: 0.7 * scaleFactor,
      max: 1.41 * scaleFactor,
    },
    rotate: {
      value: 0,
      velocity: 0,
      maxVelocity: 10,
      maxAcc: 1,
    },
    opacity: {
      value: 1,
      velocity: 0,
      maxVelocity: 1,
      maxAcc: 0.2,
      min: 0.1,
      max: 1,
    },
  },
})

const COLORS = [
  '#C1272D',
  '#F15A24',
  '#FBB03B',
  '#8CC63F',
  '#009245',
  '#29ABE2',
  '#BA9BC9',
];

const LABELS = [
  ...(new Set(
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry standard dummy text ever since the when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries'
      .toLowerCase()
      .split(' ')
      .filter(s => s.length > 3)
  ))
]

const generateAnimatedComponentProps = () => ({
  ...(JSON.parse(defaultPhysics)),
  iconIndex: Math.floor(Math.random() * 6),
  backgroundColor: `rgba(0, 0, 0, ${randomRange(0.4, 0.8)})`,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  label: LABELS[Math.floor(Math.random() * LABELS.length)],
})

const generateAnimatedComponentPropsArray = (count) => {
  const result = []
  while (result.length < count) {
    result.push(generateAnimatedComponentProps())
  }
  return result
}





class AnimationStage extends React.PureComponent {

  state = {
    animating: false,
    componentCount: 0,
    componentsProps: [],
  }

  tickQueue = []

  minFrameDuration = 1000 / 30

  componentDidMount() {
    this.raf()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandle)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.animating && !nextProps.animating) {
      window.fpsRef.innerHTML = 'paused'
    }
    if (prevState.componentCount !== nextProps.componentCount) {
      return {
        animating: nextProps.animating,
        componentCount: nextProps.componentCount,
        componentsProps: [
          ...prevState.componentsProps.slice(0, nextProps.componentCount),
          ...generateAnimatedComponentPropsArray(nextProps.componentCount - prevState.componentCount)
        ]
      }
    }
    return null
  }

  raf = () => {
    this.rafHandle = window.requestAnimationFrame(this.tick)
  }

  tick = () => {
    this.rafHandle = 0
    const { lastTickTime, minFrameDuration } = this
    const { animating } = this.props
    const { componentsProps } = this.state
    const now = +Date.now()
    if (animating && (!lastTickTime || now - lastTickTime > minFrameDuration)) {
      const timeDelta = (now - lastTickTime) / 1000 || 1 / 60
      console.log(timeDelta)
      this.lastTickTime = now
      componentsProps.forEach(compProps => {
        Object.values(compProps.animatedProps).forEach(prop => tickPhysics(prop, timeDelta))
      })
      if (!this.firstTickTimestamp) {
        this.firstTickTimestamp = now
      }
      console.log('AnimationStage.forceUpdate');
      this.forceUpdate(() => {
        console.log('AnimationStage.forceUpdate completed')
        this.measureFps()
        this.raf()
      })
    }
    else {
      this.raf()
    }
  }

  measureFps() {
    const { tickQueue } = this
    const now = +Date.now()
    tickQueue.push(now)
    const fpsSampleDuration = 2000
    const fpsUpdateInterval = 500
    const freshTicks = this.tickQueue = tickQueue.filter(tick => now - tick < fpsSampleDuration)
    if (freshTicks.length > 1) {
      const newFps = Math.round(1000 * (freshTicks.length - 1) / (freshTicks[freshTicks.length - 1] - freshTicks[0]))
      if (!this.lastFpsTimestamp || now - this.lastFpsTimestamp >= fpsUpdateInterval) {
        const durations = freshTicks
          .map((tick, index) => index ? tick - freshTicks[index - 1] : 0)
          .slice(1)
        const minFps = Math.round(1000 / Math.max(...durations))
        const message = `min: ${minFps} fps - avg: ${newFps} fps`
        //  - durations(${durations.length}): ${durations.join()}
        window.fpsRef.innerHTML = message
        this.lastFps = newFps
        this.lastFpsTimestamp = now
      }

    }
  }

  componentDidUpdate() {
    console.log('AnimationStage.componentDidUpdate')
  }

  render() {
    console.log('AnimationStage.render')
    const { optimized } = this.props
    const width = 1200
    const height = 1200
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
        {/* <g transform={`translate(${width / 2} ${height / 2})`}> */}
        <g>
          {optimized
            ? (
              this.state.componentsProps.map((compProps, index) => {
                const { animatedProps, ...childProps } = compProps
                const { x, y, rotate, scale, opacity } = animatedProps
                return (
                  <AnimatedComponent
                    key={index}
                    childProps={childProps}
                    childComponent={ComplexComponent}
                    animationProps={{
                      opacity,
                      transform: `scale(${scale.value}) translate3d(${x.value}px, ${y.value}px, 0) rotate(${rotate.value}deg)`,
                    }}
                  />
                )
              }))
            : (
              this.state.componentsProps.map((compProps, index) => {
                // const { animatedProps, ...childProps } = compProps
                // const { x, y, rotate, scale, opacity } = animatedProps
                return (
                  // <ComplexComponent
                  //   key={index}
                  //   style={{
                  //     opacity,
                  //     transform: `scale(${scale.value}) translate(${x.value}px, ${y.value}px) rotate(${rotate.value}deg)`,
                  //   }}
                  //   {...childProps}
                  // />
                  null
                )
              }))
          }
        </g>
      </svg>
    )
  }
}

export default AnimationStage