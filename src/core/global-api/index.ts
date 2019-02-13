import config from '@/core/config';
import { set, del } from '@/core/observer';
import { nextTick, extend } from '@/core/util';
import { ASSET_TYPES } from '@/shared/constants';
import * as buildInComponents from '@/core/components';
import { initUse } from './use';
import { initMixin } from './mixin';
import { initExtend } from './extend';
import { initAssetRegisters } from './assets';

function initGlobalAPI(Vue: Vue) {
  const configDef = {
    get() {
      return config;
    },
  };
  Object.defineProperty(Vue, 'config', configDef);

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.observable = function(obj: any): any {};

  Vue.options = Object.create(null);
  // 为什么用 let...of... 而不是 forEach ？
  // 语意上 forEach 更倾向于对每一个枚举项 do something
  // 此处只是单纯地取出 key，用于另一个对象
  for (let type of ASSET_TYPES) {
    Vue.options[`${type}s`] = Object.create(null);
  }

  // TODO: 此处似乎不需要；用于 weex
  Vue.options._base = Vue;

  extend(Vue.options.components, buildInComponents);

  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

export { initGlobalAPI };
