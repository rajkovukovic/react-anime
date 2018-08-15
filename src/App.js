import * as React from 'react'
import './App.css'

import shallowEqualObjects from 'shallow-equal/objects'

// const forwardValue = value => value

// const addPxToNonZeroNumber = n => typeof n === 'number' && n
//   ? n + 'px'
//   : n

// const computeAnimationPropsFns = {
//   opacity: forwardValue,
//   transformOrigin: forwardValue,
//   transform: forwardValue,
// }

// const computeAnimationProps = (transform) => {
//   if (!transform) return null
//   const result = Object.entries(transform).reduce(
//     (acc, [key, value]) => {
//       if (!computeTransformFns[key]) {
//         throw Error(`computeTransformFns[${key}] not implemented`)
//       }
//       acc[key] = computeTransformFns[key](value)
//       return acc
//     },
//     {}
//   )
// }

const randomRange = (min, max) => Math.random( max - min ) + min

const doPhysics = n => {
  n.velocity += randomRange( -n.maxAcc, n.maxAcc )
  n.value += n.velocity
  if (n.hasOwnProperty('min') && n.value < n.min) {
    n.value = n.min
    if (Math.sign(n.velocity) < 0) {
      n.velocity = -n.velocity
    }
  }
  if (n.hasOwnProperty('max') && n.value > n.max) {
    n.value = n.max
    if (Math.sign(n.velocity) > 0) {
      n.velocity = -n.velocity
    }
  }
  return n
}

class ComplexComponent extends React.Component {
  render() {
    const { prefix, code, suffix } = this.props
    console.log('ComplexComponent.render')
    return (
      <p className="App-intro"> {prefix}<code>{code}</code>{suffix} </p>
    )
  }
}


class AnimatedComponent extends React.Component {
  constructor (props) {
    super(props)
    this.onPropsChange(props)
  }

  shouldComponentUpdate(nextProps) {
    return this.onPropsChange(nextProps)
  }

  onPropsChange = (nextProps) => {
    if (nextProps.children) {
      throw Error('AnimatedComponent can not have children because of performance issues. Use props childComponent and childProps to achieve render caching.')
    }
    const { childComponent: ChildComponent, childProps = {}, animationProps } = nextProps
    let componentShouldUpdate = false
    // if child component or its props has changed rerender and cache result
    if (!this.lastChildComponent || this.lastChildComponent !== ChildComponent || !shallowEqualObjects(this.lastChildProps, childProps)) {
      this.lastChildComponent = ChildComponent
      this.lastChildProps = childProps
      this.lastRenderResult = <ChildComponent {...childProps} ref={this.onRefUpdate}/>
      componentShouldUpdate = true
    }
    // if animation related data (animationProps prop) has changed recalc it
    if (!this.lastAnimationProps || !shallowEqualObjects(this.lastAnimationProps, animationProps)) {
      this.lastAnimationProps = animationProps
      this.computedAnimationProps = animationProps
      if (!componentShouldUpdate) {
        this.applyAnimationPropsToDomRef()
      }
    }
    return componentShouldUpdate
  }

  applyAnimationPropsToDomRef = () => {
    const { computedAnimationProps, domRef } = this.domRef
    if (domRef) {
      Object.entries(computedAnimationProps).forEach(([key, value]) => domRef.style[key] = value)
    }
  }

  onRefUpdate = (domRef) => {
    console.log('ref changed: ', domRef)
    const { childProps } = this.props
    this.domRef = domRef
    if (domRef) {
      this.applyAnimationPropsToDomRef()
    }
    if (childProps.ref) {
      childProps.ref(domRef)
    }
  }

  render () {
    return this.lastRenderResult
  }
}




class App extends React.Component {
  state = {
    counter: 0,
    playing: true,
  }

  componentDidMount() {
    this.physics = {
      x: {
        value: 0,
        velocity: 0,
        maxAcc: 0.5,
        min: -200,
        max: 200,
      },
      y: {
        value: 0,
        velocity: 0,
        maxAcc: 0.5,
        min: -200,
        max: 200,
      },
      opacity: {
        value: 0,
        velocity: 0,
        maxAcc: 0.1,
        min: 0,
        max: 1,
      },
      rotate: {
        value: 0,
        velocity: 0,
        maxAcc: 3,
      },
    }
    this.rafHandle = window.requestAnimationFrame(this.tick)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandle)
  }
  
  tick = () => {
    const { physics, lastTickTime } = this
    console.log('raf')
    if (this.state.playing && (!lastTickTime || lastTickTime > Date.now() + 2000)) {
      console.log('tick')
      this.lastTickTime = Date.now()
      Object.values(physics).forEach(prop => doPhysics(prop))
      this.setState({
        opacity: physics.opacity.value,
        transform: `translate(${ physics.x.value }px, ${ physics.y.value }px) rotate(${ physics.rotate.value }deg)`,
      })
    }
    window.requestAnimationFrame(this.tick)
  }

  increaseCounter = () => this.setState ({counter: this.state.counter + 1})

  toggleAnimation = () => this.setState ({playing: !this.state.playing})

  render () {
    const { counter, playing, opacity, transform } = this.state
    console.log ('App.render')
    const childProps = {
      prefix: 'To get started, edit ',
      code: 'src/App.js',
      suffix: ` dozen: ${Math.floor(counter / 10)}`,
    }
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.toggleAnimation}>{playing ? 'pause' : 'play'}</button>
          <button onClick={this.increaseCounter}>{counter}</button>
        </header>

        <AnimatedComponent
          childProps={childProps}
          childComponent={ComplexComponent}
          animationProps={{
            opacity,
            transform,
          }}
        />
      </div>
    )
  }
}

export default App
