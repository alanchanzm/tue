import { _init } from './init';
import { $set, $delete, $watch } from './state';
import { $on, $once, $off, $emit } from './events';
import { _update, $forceUpdate, $destroy } from './lifecycle';
import { $nextTick, _render } from './render';

abstract class InitVue {
  _uid: number;
  _isVue = false;
  _data;
  _props;
  _watchers;
  $options;
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

class VueCtor extends InitVue implements IVueModel {
  static options;

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

function Vue(options: IVueOptions, Ctor: IVueConstructor = VueCtor): IVueModel {
  return new Ctor(options);
}

export default Vue;
