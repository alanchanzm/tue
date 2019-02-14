import { _init } from './init';
import { $set, $delete, $watch } from './state';
import { $on, $once, $off, $emit } from './events';
import { _update, $forceUpdate, $destroy } from './lifecycle';
import { $nextTick, _render } from './render';

abstract class InitVue {
  _data;
  _props;
  // init
  _init = _init;
  // state
  $set = $set;
  $delete = $delete;
  $watch = $watch;
  // events
  $on = $on;
  $once = $once;
  $off = $off;
  $emit = $emit;
  // lifecycle
  _update = _update;
  $forceUpdate = $forceUpdate;
  $destroy = $destroy;
  // render
  $nextTick = $nextTick;
  _render = _render;
  // for runtime
  __patch__;
  $mount;
}

class Vue extends InitVue implements IVue {
  static options: IVueOptions;

  constructor(options: IVueOptions) {
    super();
    this._init(options);
  }

  get $data() {
    return this._data;
  }

  get $props() {
    return this._props;
  }
}

export default Vue;
