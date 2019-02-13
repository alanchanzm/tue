import { VNode } from './vnode';
import { isArray, isPrimitive } from '../util';

function addNS(data, children) {
  data.ns = 'http://www.w3.org/2000/svg';
  if (children !== undefined) {
    for (const child of children) {
      addNS(child.data, child.children);
    }
  }
}

function h(tag, b, c) {
  let data = {};
  let children;
  let text;
  let i;
  if (arguments.length === 3) {
    data = b;
  }
}

export { h };
