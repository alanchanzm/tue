function initExtend(Vue: Vue) {
  Vue.cid = 0;
  Vue.extend = function() {};
}

export { initExtend };
