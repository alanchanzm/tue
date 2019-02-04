import { observe } from '../observer/index';

// Vue
class Component {
  /**
   * Vue 实例参数，包括 el、data、methods等
   * @param {object} options
   */
  constructor(options) {
    this.$options = options;
    this._data = options.data;
    this._el = document.querySelector(options.el);
    const el = this._el;
    // TODO:
    this._ob = observe(options.data);
  }
  _proxy(key) {}

  _renderClass(dynamic, cls) {}

  _update(vtree) {}

  __flatten__(arr) {}
}

export { Component };
