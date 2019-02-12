declare interface ComponentOptions {}
declare interface Vue extends Function {
  config?: Object;
  set?: Function;
  delete?: Function;
  nextTick?: Function;
  observable?: Function;
}
