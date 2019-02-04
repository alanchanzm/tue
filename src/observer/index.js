import { hasOwn, isArray, isPlainObject } from '../util/index';

const shouldConvert = true;

class Observer {}

function observe(value, vm) {
  if (!value || typeof value !== 'object') return;

  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    // 避免重复观测
    // __ob__ 是 Observer 的实例
    // 当一个对象被观测后就会添加 __ob__ 属性
    ob = value.__ob__;
  } else if (
    shouldConvert &&
    (isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }

  // TODO:
  if (ob && vm) ob.addVm(vm);

  return ob;
}

export { observe };
