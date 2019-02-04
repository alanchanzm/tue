import { Dep } from './dep';
import { arrayMethods } from './array';
import { def, hasOwn, hasProto, isArray, isPlainObject } from '../util/index';

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
const shouldConvert = true;

class Observer {
  /**
   * @param {Array|Object} value 待观测数据
   */
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this);

    if (isArray(value)) {
      // TODO:
      const augment = hasProto ? Observer.protoAugment : Observer.copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    }
  }

  /**
   * 遍历数组并监测
   * @param {any[]} items
   */
  observeArray(items) {
    items.forEach(item => observe(item));
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      this.convert(key, obj[key]);
    }
  }

  convert(key, val) {
    defineReactive(this.value, key, val);
  }

  // TODO:
  addVm(vm) {
    this.vms = this.vms || [];
    this.vms.push(vm);
  }

  // TODO:
  removeVm(vm) {
    this.vms.$remove(vm); // 来自 array
  }

  static protoAugment(target, src) {
    // 应避免设置对象的 [[Prototype]]
    // target.__proto__ = src;
    Object.setPrototypeOf(target, src);
  }

  static copyAugment(target, src, keys) {
    for (const key of keys) {
      def(target, key, src[key]);
    }
  }
}

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

function defineReactive(obj, key, val) {
  const dep = new Dep();

  // 获取自有属性对应的属性描述符
  // configurable 属性描述符不可改变就不需要监测了
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && !property.configurable) return;

  // 缓存原有的 get & set
  const getter = property && property.get;
  const setter = property && property.set;

  const childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      const value = getter ? getter.call(obj) : val;

      if (Dep.target) {
        dep.depend();
        if (childOb) childOb.dep.depend();
      }

      if (isArray(value)) {
        value.forEach(e => e && e.__ob__ && e.__ob__.dep.depend());
      }

      return value;
    },
    set(newVal) {
      const value = getter ? getter.call(obj) : val;

      if (newVal === value) return;

      if (setter) setter.call(obj, newVal);
      else val = newVal;

      childOb = observe(newVal);

      dep.notify();
    },
  });
}

export { Observer, observe, defineReactive };
