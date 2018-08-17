
import { limitToRange, randomRange } from './helpers';

const Deg90 = Math.PI / 4
const Deg180 = Math.PI / 2

const scaleFactor = 1
const defaultPhysics = JSON.stringify ({
  animatedProps: {
    position: {
      speed: {
        value: 0.5,
        min: 0,
        max: 1,
        velocity: 0.1,
        minVelocity: 0,
        maxVelocity: 1,
        maxAcc: 0.1,
      },
      angle: {
        value: 0,
        velocity: 0,
        maxVelocity: 0.1,
        maxAcc: 0.01,
      },
      depth: {
        value: -200,
        velocity: 0,
        maxVelocity: 0.1,
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
  if (maxAcc) {
    n.velocity += randomRange (-maxAcc, maxAcc)
    n.velocity = Math.sign (n.velocity) * limitToRange(Math.abs(n.velocity), minVelocity, maxVelocity)
  }
  else {
    n.velocity = randomRange(n.minVelocity, n.maxVelocity)
  }
  n.value += n.velocity
  n.value = Math.sign (n.value) * limitToRange(Math.abs(n.value), min, max)
  return n;
};

const tickPosition = (position, options) => {
  tickPhysicsProperty(position.speed, options)
  tickPhysicsProperty(position.angle, options)
  tickPhysicsProperty(position.depth, options)
  const speed = position.speed.value
  const angle = position.angle
  const { xMin, xMax, yMin, yMax } = options
  position.x += speed * Math.cos(angle.value)
  position.y += speed * Math.sin(angle.value)
  position.z = position.depth.value
  if (position.x < xMin || position.x > xMax) {
    angle.value += Deg90
  }
  if (position.y < yMin || position.y > yMax) {
    angle.value = Deg180 - angle.value
  }
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
