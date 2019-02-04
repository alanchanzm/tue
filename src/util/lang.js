/**
 * Object.defineProperty 的代理方法，
 * writable、configurable 默认设为 true
 */
function def(obj, key, value, enumerable = false) {
  Object.defineProperty(obj, key, {
    value,
    enumerable,
    writable: true,
    configurable: true,
  });
}

/**
 * Object.prototype.hasOwnProperty 的代理方法，
 * 判断是否对象自身是否存在某属性
 */
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

const { isArray } = Array;

/**
 * 严格判断是不是对象
 */
function isPlainObject(obj) {
  const OBJECT_STRING = '[object Object]';
  return Object.prototype.toString.call(obj) === OBJECT_STRING;
}

export { def, hasOwn, isArray, isPlainObject };
