
const randomRange = (min, max) => Math.random() * (max - min) + min

const tickPhysics = n => {
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

export {
  randomRange,
  tickPhysics,
}