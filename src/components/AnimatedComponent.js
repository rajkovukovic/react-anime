import * as React from 'react'
import shallowEqual from 'shallowequal'

class AnimatedComponent extends React.Component {
  constructor(props) {
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
    // if childComponent or childProps has changed rerender and cache result
    if (!this.lastChildComponent || this.lastChildComponent !== ChildComponent || !shallowEqual(this.lastChildProps, childProps)) {
      this.lastChildComponent = ChildComponent
      this.lastChildProps = childProps
      this.lastRenderResult = 
      componentShouldUpdate = true
    }
    // if animation related data (animationProps prop) has changed recalc it
    if (!shallowEqual(this.props.animationProps, animationProps)) {
      if (!componentShouldUpdate) {
        this.applyAnimationPropsToDomRef()
      }
    }
    return componentShouldUpdate
  }

  applyAnimationPropsToDomRef = () => {
    const { domRef } = this
    const { animationProps } = this.props
    if (domRef) {
      if (!domRef.style) {
        console.error('domRef is not dom element', domRef)
      }
      // Object.entries(animationProps).forEach( ([ key, value ]) => domRef.setAttribute(key, value) )
      Object.entries(animationProps).forEach( ([ key, value ]) => domRef.style[key] = value )
    }
  }

  onRefUpdate = (domRef) => {
    // console.log('ref changed: ', domRef)
    const { childProps } = this.props
    this.domRef = domRef
    if (domRef) {
      this.applyAnimationPropsToDomRef()
    }
    if (childProps.ref) {
      childProps.ref(domRef)
    }
  }

  render() {
    const { childComponent: ChildComponent, childProps } = this.props
    console.log('AnimatedComponent.render')
    return <ChildComponent {...childProps} ref={this.onRefUpdate} />
  }
}

export default AnimatedComponent