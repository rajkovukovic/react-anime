import * as React from 'react';
import PropTypes from 'prop-types'

import shallowEqual from 'shallowequal';
import { propsEqual } from 'react-shallow-equal';


import {AnimatedComponent, ComplexComponent} from './index';
import {
  generateAnimatedComponentPropsArray,
  tickPhysics,
} from '../utils/physics';

class AnimationContent extends React.Component {

  static propTypes = {
    animating: PropTypes.bool.isRequired,
    componentCount: PropTypes.number.isRequired,
    optimized: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }

  state = {
    animating: false,
    componentCount: 0,
    componentsProps: [],
  };

  componentDidMount () {
    this.raf ();
  }

  componentWillUnmount () {
    window.cancelAnimationFrame (this.rafHandle);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      !propsEqual (this.props, nextProps, { ignore: ['width', 'height'] }) ||
      !shallowEqual (this.state, nextState)
    );
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.animating && !nextProps.animating) {
      window.fpsRef.innerHTML = 'paused';
    }
    if (prevState.componentCount !== nextProps.componentCount) {
      return {
        animating: nextProps.animating,
        componentCount: nextProps.componentCount,
        componentsProps: [
          ...prevState.componentsProps.slice (0, nextProps.componentCount), // remove extra components if componentCount is reducing
          ...generateAnimatedComponentPropsArray (  // add extra components if componentCount is increasing
            nextProps.componentCount - prevState.componentCount,
            prevState.componentCount
          ),
        ],
      };
    }
    return null;
  }

  tickQueue = [];

  minFrameDuration = 1000 / 30;

  raf = () => {
    this.rafHandle = window.requestAnimationFrame (this.tick);
  };

  tick = () => {
    this.rafHandle = 0;
    const {lastTickTime, minFrameDuration} = this
    const {animating, width, height} = this.props
    const {componentsProps} = this.state
    const now = +Date.now ()
    if (animating && (!lastTickTime || now - lastTickTime > minFrameDuration)) {
      const timeDelta = (now - lastTickTime) / 1000 || 1 / 60;
      this.lastTickTime = now;
      tickPhysics (componentsProps, {
        timeDelta,
        xMin: -width / 2,
        xMax: +width / 2,
        yMin: -height / 2,
        yMax: +height / 2,
      });
      if (!this.firstTickTimestamp) {
        this.firstTickTimestamp = now;
      }
      this.forceUpdate (() => {
        this.raf ();
      });
    } else {
      this.raf ();
    }
  }

  onChildClick = (index) => {
    console.log( this.state.componentsProps[index].animatedProps )
  }

  render () {
    // console.log ('Content.render');
    // const { optimized } = this.props
    const {componentsProps} = this.state;
    return (
      // optimized
      // ? (
      componentsProps.map (( compProps, index ) => {
        const { animatedProps, ...childProps } = compProps;
        const { position, rotate, scale, opacity } = animatedProps;
        return (
          <AnimatedComponent
            key={index}
            childProps={{...childProps, clickHandle: this.onChildClick }}
            childComponent={ComplexComponent}
            animationProps={{
              opacity,
              transform: `scale(${scale.value}) translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotate.value}deg)`,
            }}
          />
        )
      })
      // )
      // : (
      //   this.state.componentsProps.map((compProps, index) => {
      //     const { animatedProps, ...childProps } = compProps
      //     const { x, y, rotate, scale, opacity } = animatedProps
      //     return (
      //       <ComplexComponent
      //         key={index}
      //         style={{
      //           opacity,
      //           transform: `scale(${scale.value}) translate(${x.value}px, ${y.value}px) rotate(${rotate.value}deg)`,
      //         }}
      //         {...childProps}
      //       />
      //     )
      //   }))
    );
  }
}

export default AnimationContent;
