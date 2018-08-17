import * as React from 'react'
import './App.css'

import { AnimationStage } from './components'

class App extends React.Component {
  state = {
    componentCount: 1,
    animating: true,
    optimized: true,
  }

  trySetComponentCount = newValue => {
    const value = Math.floor(newValue * 1)
    if (!Number.isNaN(value) && value > 0) {
      this.setState({
        componentCount: value,
      })
    }
  }

  onComponentCountChange = (event) => {
    this.trySetComponentCount(event.target.value)
  }

  toggleAnimation = () => {
    this.setState( prevState => ({ animating: !prevState.animating }))
  }

  toggleOptimization = () => {
    this.setState( prevState => ({ optimized: !prevState.optimized }))
  }

  render() {
    const { componentCount, animating, optimized } = this.state
    console.log('App.render')
    return (
      <div className="App">
        <header className="App-header">
          <label htmlFor='input-optimizing'>
            <input id='input-optimizing' type='checkbox' onChange={this.toggleOptimization} checked={optimized} />
            {' Optimize '}
          </label>
          <label htmlFor='input-animating'>
            <input id='input-animating' type='checkbox' onChange={this.toggleAnimation} checked={animating} />
            {' Animating '}
          </label>
          <label htmlFor='input-component-count'>
            <input
              id='input-component-count'
              type='number'
              value={this.inputComponentCountFocused ? undefined : componentCount}
              // onFocus={this.onComponentCountFocus}
              // onBlur={this.onComponentCountBlur}
              // onKeyDown={this.onComponentCountKeyDown}
              onChange={this.onComponentCountChange}
            />
            {' Components'}
          </label>
        </header>

        <AnimationStage {...this.state} />
      </div>
    )
  }
}

export default App
