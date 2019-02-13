import { set, del } from '@/core/observer';

function stateMixin(Vue: Vue) {
  const dataDef = {
    get() {
      return this._data;
    },
  };
  const propsDef = {
    get() {
      return this._props;
    },
  };

  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;
  Vue.prototype.$watch = function() {};
}

export { stateMixin };
