import { isValidArrayIndex } from '@/util';

function set(target: Array<any> | Object, key: any, val: any) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  // TODO set
}

function del() {}

function observe() {}

export { set, del, observe };
