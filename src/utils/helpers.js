
const average = array => array.reduce( ( acc, cur ) => acc + cur, 0 ) / array.length

const randomRange = (min, max) => Math.random() * (max - min) + min

const tickPhysics = (n, multiplier = 1) => {
  const maxAcc = n.maxAcc * multiplier
  const maxVelocity = n.maxVelocity * multiplier
  n.velocity += randomRange(-maxAcc, maxAcc)
  if (maxVelocity && Math.abs(n.velocity) > maxVelocity) {
    n.velocity = Math.sign(n.velocity) > 0
      ? + maxVelocity
      : - maxVelocity
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

export {
  average,
  randomRange,
  tickPhysics,
}