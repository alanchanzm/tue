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

function makeMap(str: string, expectsLowerCase: boolean = false): Function {
  const map = Object.create(null);
  const list = str.split(',');
  for (let key of list) {
    map[key] = true;
  }
  return (val: string): boolean => {
    const key = expectsLowerCase ? val.toLowerCase() : val;
    return map[key] || false;
  };
}

const isBuildInTag = makeMap('solt,component', true);

const identity = (id: any) => id;
const noop = (a?: any, b?: any, c?: any, d?: any) => {};
const no = () => false;

export { isValidArrayIndex, extend, makeMap, isBuildInTag, identity, noop, no };
