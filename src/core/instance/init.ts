function initMixin(Vue: Vue) {
  Vue.prototype._init = function(options?: ComponentOptions) {};
}

export { initMixin };
