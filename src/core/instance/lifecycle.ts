function lifecycleMixin(Vue: Vue) {
  Vue.prototype._update = function() {};
  Vue.prototype.$forceUpdate = function() {};
  Vue.prototype.$destroy = function() {};
}

export { lifecycleMixin };
