import * as React from 'react'
import shallowEqualObjects from 'shallow-equal/objects'

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
    // if childComponent or ichildProps has changed rerender and cache result
    if (!this.lastChildComponent || this.lastChildComponent !== ChildComponent || !shallowEqualObjects(this.lastChildProps, childProps)) {
      this.lastChildComponent = ChildComponent
      this.lastChildProps = childProps
      this.lastRenderResult = <ChildComponent {...childProps} ref={this.onRefUpdate} />
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
    const { computedAnimationProps, domRef } = this
    if (domRef) {
      if (!domRef.style) {
        console.error('domRef is not dom element', domRef)
      }
      Object.entries(computedAnimationProps).forEach(([key, value]) => domRef.style[key] = value)
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
    return this.lastRenderResult
  }
}

export default AnimatedComponent