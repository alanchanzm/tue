/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val: any): boolean {
  const n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

const identity = (id: any) => id;
const noop = () => {};
const no = () => false;

export { isValidArrayIndex, identity, noop, no };
