/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val: any): boolean {
  const n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

function extend(to: Object, _from: Object = {}): Object {
  return Object.assign(to, _from);
}

const identity = (id: any) => id;
const noop = () => {};
const no = () => false;

export { isValidArrayIndex, extend, identity, noop, no };
