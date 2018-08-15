import * as React from 'react'

import { AnimatedComponent, ComplexComponent } from './index'

import { randomRange, tickPhysics } from '../utils/helpers'

const defaultPhysics = JSON.stringify({
  animatedProps: {
    x: {
      value: 0,
      velocity: 0,
      maxVelocity: 2,
      maxAcc: 0.05,
      min: -200,
      max: 200,
    },
    y: {
      value: 0,
      velocity: 0,
      maxVelocity: 2,
      maxAcc: 0.05,
      min: -200,
      max: 200,
    },
    opacity: {
      value: 1,
      velocity: 0,
      maxVelocity: 0.05,
      maxAcc: 0.005,
      min: 0.1,
      max: 1,
    },
    scale: {
      value: 1,
      velocity: 0,
      maxVelocity: 0.05,
      maxAcc: 0.005,
      min: 0.5,
      max: 1.5,
    },
    rotate: {
      value: 0,
      velocity: 0,
      maxVelocity: 6,
      maxAcc: 0.3,
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
  backgroundColor: `rgba(0, 0, 0, ${ randomRange(0.4, 0.8) })`,
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
    componentCount: 0,
    componentsProps: [],
  }

  minFrameDuration = 1

  componentDidMount() {
    this.rafHandle = window.requestAnimationFrame(this.tick)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandle)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.componentCount !== nextProps.componentCount) {
      return {
        componentCount: nextProps.componentCount,
        componentsProps: [
          ...prevState.componentsProps.splice(nextProps.componentCount),
          ...generateAnimatedComponentPropsArray(nextProps.componentCount - prevState.componentCount)
        ]
      }
    }
    return null
  }

  tick = () => {
    const { lastTickTime, minFrameDuration } = this
    const { animating } = this.props
    const { componentsProps } = this.state
    if (animating && (!lastTickTime || Date.now() - lastTickTime > minFrameDuration)) {
      this.lastTickTime = Date.now()
      componentsProps.forEach(compProps => {
        Object.values(compProps.animatedProps).forEach(prop => tickPhysics(prop))
      })
      this.forceUpdate()
    }
    window.requestAnimationFrame(this.tick)
  }

  render() {
    return (
      <div className='animation-stage'>
        {this.state.componentsProps.map((compProps, index) => {
          const { animatedProps, ...childProps } = compProps
          const { x, y, rotate, scale, opacity } = animatedProps
          return (
            <AnimatedComponent
              key={index}
              childProps={childProps}
              childComponent={ComplexComponent}
              animationProps={{
                opacity,
                transform: `scale(${scale.value}) translate(${x.value}px, ${y.value}px) rotate(${rotate.value}deg)`,
              }}
            />
          )
        })}
      </div>
    )
  }
}

export default AnimationStage