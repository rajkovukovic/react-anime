import * as React from 'react'
import './App.css'

import { AnimationStage } from './components'

class App extends React.Component {
  state = {
    componentCount: 20,
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

  // onComponentCountFocus = (event) => {
  //   this.inputComponentCountFocused = true
  //   this.trySetComponentCount(event.target.value)
  // }

  // onComponentCountBlur = (event) => {
  //   this.inputComponentCountFocused = false
  //   this.trySetComponentCount(event.target.value)
  // }

  // onComponentCountKeyDown = (event) => {
  //   if (event.keyCode === 13) {
  //     this.trySetComponentCount(event.target.value)
  //   }
  // }

  onComponentCountChange = (event) => {
    this.trySetComponentCount(event.target.value)
  }

  toggleAnimation = () => {
    this.setState({ animating: !this.state.animating })
  }

  toggleOptimization = () => {
    this.setState({ optimized: !this.state.optimized })
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
        <AnimationStage componentCount={componentCount} animating={animating} optimized={optimized} />
      </div>
    )
  }
}

export default App
