import config from '@/config';
import { set, del } from '@/observer';
import { nextTick } from '@/util';

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
}

export { initGlobalAPI };
