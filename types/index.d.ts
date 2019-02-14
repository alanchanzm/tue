interface IVueOptions {
  [key: string]: any;
}

interface IVueConstructor {
  new (options: IVueOptions): any;
}

interface IVue {
  _data: any;
  _props: any;
  // options: IVueOptions;
  // init
  _init(options: IVueOptions): void;
  // state
  $set(target: Array<any> | Object, key: any, val: any);
  $delete();
  $watch();
  // events
  $on();
  $once();
  $off();
  $emit();
  // lifecycle
  _update();
  $forceUpdate();
  $destroy();

  __patch__();
  $mount();
}

// declare interface Vue extends Function {
//   cid?: number;
//   config?: Object;
//   set?: Function;
//   delete?: Function;
//   nextTick?: Function;
//   observable?: Function;
//   options?: any; //TODO
//   use?: Function;
//   mixin?: Function;
//   extend?: Function;
//   component?: Function;
//   directive?: Function;
//   filter?: Function;
// }
