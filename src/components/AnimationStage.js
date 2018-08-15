import * as React from 'react'

import { AnimatedComponent, ComplexComponent } from './index'

const defaultPhysics = `{
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
}`

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

const generateAnimatedComponentProps = () => {
  return {
    ...JSON.parse(defaultPhysics),
    iconIndex: Math.floor(Math.random() * 6),
    backgroundColor: `rgba(0, 0, 0, ${Math.random() * 0.5})`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    label: LABELS[Math.floor(Math.random() * LABELS.length)],
  }
}

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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.componentCount !== nextProps.componentCount) {
      return {
        componentCount: nextProps.componentCount,
        componentsProps: [
          ...prevState.componentsProps.splice(nextProps.componentCount),
          generateAnimatedComponentPropsArray(nextProps.componentCount - prevState.componentCount)
        ]
      }
    }
    return null
  }

  render() {
    return (
      this.state.componentsProps.map(compProps => {
        const { x, y, rotate, scale, opacity, ...childProps } = compProps
        return (
          <AnimatedComponent
            childProps={childProps}
            childComponent={ComplexComponent}
            animationProps={{
              opacity,
              transform: ``,
            }}
          />
        )
      })
    )
  }
}

export default AnimationStage