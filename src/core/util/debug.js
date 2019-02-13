import config from '../config';
import { hyphenate } from './index';

let warn;
let formatComponentName;

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined';

  formatComponentName = vm => {
    var name = vm._isVue ? vm.$options.name : vm.name;
    return name ? ' (found in component: <' + hyphenate(name) + '>)' : '';
  };

  warn = (msg, vm) => {
    if (hasConsole && !config.silent) {
      console.error('[Vue warn]: ' + msg + (vm ? formatComponentName(vm) : ''));
    }
  };
}

export { warn };
