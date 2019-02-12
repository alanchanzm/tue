declare interface ComponentOptions {}
declare interface Vue extends Function {
  cid?: number;
  config?: Object;
  set?: Function;
  delete?: Function;
  nextTick?: Function;
  observable?: Function;
  options: any; //TODO
  use?: Function;
  mixin?: Function;
  extend?: Function;
  component?: Function;
  directive?: Function;
  filter?: Function;
}
