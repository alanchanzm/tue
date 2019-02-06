import { compile } from '../compiler';
import { observe } from '../observer';
import { Watcher } from '../observer/watcher';
import { patch } from '../vdom';
import { getOutHTML, isReserved, nextTick } from '../util';

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
    const render = compile(getOutHTML(el));
    this._el.innerHTML = '';
    Object.keys(options.data).forEach(key => this._proxy(key));
    if (options.methods) {
      Object.keys(options.methods).forEach(name => {
        this[name] = options.methods[name].bind(this);
      });
    }
    this._ob = observe(options.data);
    this._watchers = [];
    this._watcher = new Watcher(this, render, this._update);
    this._update(this._watcher.value);
  }
  _proxy(key) {
    if (isReserved(key)) return;

    const self = this;
    Object.defineProperty(self, key, {
      configurable: true,
      enumerable: true,
      get() {
        return self._data[key];
      },
      set(val) {
        self._data[key] = val;
      },
    });
  }

  _renderClass(dynamic, cls) {
    switch (true) {
      case !dynamic:
        dynamic = '';
        break;
      case typeof dynamic === 'string':
        dynamic = dynamic;
        break;
      default:
        dynamic = Object.keys(dynamic)
          .filter(key => dynamic[key])
          .join(' ');
    }

    return cls ? `${cls} ${dynamic}` : dynamic;
  }

  _update(vtree) {
    const oldVnode = this._tree || this._el;
    patch(oldVnode, vtree);
    this._tree = vtree;
  }

  /**
   * @param {Array} arr
   */
  __flatten__(arr) {
    return arr.reduce((accumulator, current) => accumulator.concat(current), []);
  }

  static nextTick(...args) {
    return nextTick(...args);
  }
}

export { Component };
