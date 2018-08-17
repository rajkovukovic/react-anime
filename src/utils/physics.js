
import { limitToRange, randomRange } from './helpers';

const scaleFactor = 3;
const defaultPhysics = JSON.stringify ({
  animatedProps: {
    position: {
      distance: {
        value: 20,
        velocity: 0.3,
        minVelocity: 0.2,
        maxVelocity: 0.5,
        maxAcc: 0.1,
      },
      angle: {
        value: 0,
        velocity: 0,
        maxVelocity: 0.1,
        maxAcc: 0.01,
      },
      depth: {
        value: 0,
        velocity: 0,
        maxVelocity: 0.2,
        maxAcc: 0.01,
        min: -300,
        max: 0
      },
      x: 0,
      y: 0,
      z: 0,
    },
    scale: {
      value: 1 * scaleFactor,
      velocity: 0,
      maxVelocity: 0.5,
      maxAcc: 0.1,
      min: 0.7 * scaleFactor,
      max: 1.41 * scaleFactor,
    },
    rotate: {
      value: 0,
      velocity: 0,
      maxVelocity: 0.2,
      maxAcc: 0.01,
    },
    opacity: {
      value: 1,
      velocity: 0,
      maxVelocity: 1,
      maxAcc: 0.2,
      min: 0.1,
      max: 1,
    },
  },
});

const tickPhysicsProperty = (n, {multiplier = 1, range = {}}) => {
  const {min = n.min, max = n.max} = range;
  const maxAcc = n.maxAcc * multiplier;
  const minVelocity = n.minVelocity * multiplier
  const maxVelocity = n.maxVelocity * multiplier
  n.velocity += randomRange (-maxAcc, maxAcc)
  n.velocity = Math.sign (n.velocity) * limitToRange(Math.abs(n.velocity), minVelocity, maxVelocity)
  n.value += n.velocity
  if (typeof min === 'number' && n.value < n.min) {
    n.value = n.min;
  }
  if (typeof max === 'number' && n.value > n.max) {
    n.value = n.max;
  }
  return n;
};

const tickPosition = (position, options) => {
  tickPhysicsProperty(position.distance, options)
  tickPhysicsProperty(position.angle, options)
  tickPhysicsProperty(position.depth, options)
  const distance = position.distance.value
  const angle = position.angle.value
  position.x = distance * Math.cos(angle)
  position.y = distance * Math.sin(angle)
  position.z = position.depth.value
}

const tickPhysics = (props, options) => {
  props.forEach (compProps => {
    Object.entries (compProps.animatedProps).forEach (
      ([key, prop]) =>
        key === 'position'
          ? tickPosition (prop, options)
          : tickPhysicsProperty (prop, options)
    );
  });
};

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
  ...new Set (
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry standard dummy text ever since the when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries'
      .toLowerCase ()
      .split (' ')
      .filter (s => s.length > 3)
  ),
];

const generateAnimatedComponentProps = index => ({
  ...JSON.parse (defaultPhysics),
  index,
  iconIndex: Math.floor (Math.random () * 6),
  backgroundColor: `rgba(0, 0, 0, ${randomRange (0.4, 0.8)})`,
  color: COLORS[Math.floor (Math.random () * COLORS.length)],
  label: LABELS[Math.floor (Math.random () * LABELS.length)],
});

const generateAnimatedComponentPropsArray = (count, firstIndex = 0) => {
  const result = [];
  let index = firstIndex;
  while (result.length < count) {
    result.push (generateAnimatedComponentProps (index++));
  }
  return result;
};

export {defaultPhysics, generateAnimatedComponentPropsArray, tickPhysics};
