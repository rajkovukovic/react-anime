const average = array =>
  array.reduce ((acc, cur) => acc + cur, 0) / array.length;

const limitToRange = (value, min, max) =>
  Number.isFinite (max)
    ? Number.isFinite (min)
        ? Math.max (Math.min (value, max), min)
        : Math.min (value, max)
    : Number.isFinite (min) ? Math.max (value, min) : value

const randomRange = (min, max) => Math.random () * (max - min) + min

const getViewportSize = (sizeWithScrollBars = false) =>
  sizeWithScrollBars
    ? {
        width: window.document.body.clientWidth,
        height: window.document.body.clientHeight,
      }
    : {
        width: window.innerWidth,
        height: window.innerHeight,
      };

export {average, getViewportSize, limitToRange, randomRange};
