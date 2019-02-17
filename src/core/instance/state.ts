import { set, del, observe } from '@/core/observer';
import { warn, noop } from '../util';

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

function watch() {}

function initState(vm: IVueModel) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true);
  }
}

function initData(vm: IVueModel) {
  let { data } = vm.$options;
  vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
  data = vm._data;

  // 为 vm 添加与 vm._data 同名访问器属性
  const keys = Object.keys(data);
  for (let key of keys) {
    proxy(vm, '_data', key);
  }
}

function getData(data: Function, vm: IVueModel) {
  try {
    return data.call(vm, vm);
  } catch (error) {
    warn(error, data, vm);
    return {};
  }
}

function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

export { set as $set, del as $delete, watch as $watch, initState, getData, proxy };
