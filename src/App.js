import * as React from 'react'
import './App.css'

import { AnimationStage } from './components'

class App extends React.Component {
  state = {
    componentCount: 3,
    animating: false,
  }

  increaseCounter = () => this.setState({ counter: this.state.counter + 1 })

  toggleAnimation = () => this.setState({ animating: !this.state.animating })

  render() {
    const { componentCount, animating } = this.state
    console.log('App.render')
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.toggleAnimation}>{animating ? 'pause' : 'play'}</button>
          <button onClick={this.increaseCounter}>{componentCount}</button>
        </header>
        <AnimationStage componentCount={componentCount} />
      </div>
    )
  }
}

export default App
