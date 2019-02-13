import { installRenderHelpers } from './render-helpers';

function renderMixin(Vue: Vue) {
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function() {};
  Vue.prototype._render = function() {};
}

export { renderMixin };
