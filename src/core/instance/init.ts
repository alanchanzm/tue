import Vue from './index';

let uid = 0;

function _init(options?: IVueOptions) {
  const vm: IVueModel = this;
  uid += 1;
  vm._uid = uid;
  vm._isVue = true;
  // TODO: performance

  // merge options
  if (options && options._isComponent) {
    // pass
  } else {
    // TODO: merge options
    vm.$options = {};
  }
}

function resolveConstructorOptions(Ctor: IVueConstructor) {
  const { options } = Ctor;
  // TODO: Ctor.super
  return options;
}

export { _init };
