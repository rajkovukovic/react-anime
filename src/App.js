import * as React from 'react'
import './App.css'

import { AnimationStage } from './components'

const randomRange = (min, max) => Math.random() * (max - min) + min

const doPhysics = n => {
  n.velocity += randomRange(-n.maxAcc, n.maxAcc)
  if (n.maxVelocity && Math.abs(n.velocity) > n.maxVelocity) {
    n.velocity = Math.sign(n.velocity) > 0
      ? + n.maxVelocity
      : - n.maxVelocity
  }
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

const ComplexComponent = React.forwardRef((props, ref) => {
  const { prefix, code, suffix, ...restProps } = props
  console.log('ComplexComponent.render')
  return (
    <p className="App-intro" {...restProps} ref={ref}> {prefix}<code>{code}</code>{suffix} </p>
  )
})

class App extends React.Component {
  state = {
    componentsCount: 1,
    playing: true,
  }

  componentDidMount() {
    this.physics = 
    this.rafHandle = window.requestAnimationFrame(this.tick)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandle)
  }

  tick = () => {
    const { physics, lastTickTime } = this
    const { playing } = this.state
    if (playing && (!lastTickTime || Date.now() - lastTickTime > 1)) {
      this.lastTickTime = Date.now()
      Object.values(physics).forEach(prop => doPhysics(prop))
      console.log('tick: ', {
        opacity: physics.opacity.value,
        transform: `translate(${physics.x.value}px, ${physics.y.value}px) rotate(${physics.rotate.value}deg)`,
      })
      this.setState({
        opacity: physics.opacity.value,
        transform: `translate(${physics.x.value}px, ${physics.y.value}px) rotate(${physics.rotate.value}deg)`,
      })
    }
    window.requestAnimationFrame(this.tick)
  }

  increaseCounter = () => this.setState({ counter: this.state.counter + 1 })

  toggleAnimation = () => this.setState({ playing: !this.state.playing })

  render() {
    const { counter, playing, opacity, transform } = this.state
    console.log('App.render')
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
      </div>
    )
  }
}

export default App
