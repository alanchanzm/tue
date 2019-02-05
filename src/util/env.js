import { isPlainObject } from './lang';

const hasProto = '__proto__' in {};

const inBrowser = typeof window !== 'undefined' && !isPlainObject(window);

function nextTick(nextTickHandler) {
  // TODO: 利用 MutationObserver 来触发 microtask 执行
  // 可改为 Promise
  setTimeout(nextTickHandler, 0);
}

export { hasProto, inBrowser, nextTick };
