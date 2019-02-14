import { initMixin } from './init';
import { stateMixin } from './state';
import { eventsMixin } from './events';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';

// function Vue(options: ComponentOptions) {
//   this._init(options);
// }

class Vue implements Vue {
  static options: any;
  _init: Function;
  __patch__?: Function;
  $mount?: Function;
  constructor(options: ComponentOptions) {
    this._init(options);
  }
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
