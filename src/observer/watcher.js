import config from '../config';
import { Dep } from './dep';
import { pushWatcher } from './batcher';
import { isArray, isObject, warn, nextTick } from '../util';

let uid = 0;

class Watcher {
  constructor(vm, expOrFn, cb, options) {
    if (options) Object.assign(this, options);

    const isFn = typeof expOrFn === 'function';
    this.vm = vm;
    vm._watchers.push(this);
    this.expression = expOrFn;
    this.cb = cb;
    uid += 1;
    this.id = uid;
    this.active = true;
    this.dirty = this.lazy;

    this.deps = [];
    this.newDeps = [];
    this.depIds = Object.create(null);
    this.newDepIds = null;

    this.prevError = null;
    if (isfn) {
      this.getter = expOrFn;
      this.setter = undefined;
    } else {
      warn('only supports watching functions');
    }

    this.value = this.lazy ? undefined : this.get();
    this.shallow = false;
    this.queued = this.shallow;
  }

  /**
   * 触发属性的 getter
   */
  get() {
    this.beforeGet();
    const scope = this.scope || this.vm;
    let value;
    try {
      value = this.getter.call(scope, scope);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
        warn(`Error when evaluating expression "${this.expression}": ${error.toString()}`, this.vm);
      }
    }

    // 读取 value 的每一个键，以触发 watch
    if (this.deep) traverse(value);
    // 预处理
    if (this.preProcess) value = this.preProcess(value);
    // 执行 filters
    if (this.filters) value = scope._applyFilters(value, null, this.filters, false);
    // 后处理
    if (this.postProcess) value = this.postProcess(value);

    this.afterGet();
    return value;
  }

  set(value) {
    const scope = this.scope || this.vm;

    // 执行 filters
    if (this.filters) value = scope._applyFilters(value, this.value, this.filters, true);

    try {
      this.setter.call(scope, scope, value);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
        warn(`Error when evaluating setter "${this.expression}": ${error.toString()}`, this.vm);
      }
    }
  }

  beforeGet() {
    Dep.target = this;
    this.newDepIds = Object.create(null);
    this.newDeps.length = 0;
  }

  afterGet() {
    Dep.target = null;
    for (const dep of this.deps) {
      if (!this.newDepIds[dep.id]) dep.removeSub(this);
    }
    this.depIds = this.newDepIds;
    [this.deps, this.newDeps] = [this.newDeps, this.deps];
  }

  /**
   * @param {Dep} dep
   */
  addDep(dep) {
    const { id } = dep;
    if (!this.newDepIds[id]) {
      this.newDepIds[id] = true;
      this.newDeps.push(dep);
      if (!this.depIds[id]) dep.addSub(this);
    }
  }

  /**
   *
   * @param {boolean} shallow
   */
  update(shallow) {
    if (this.lazy) this.dirty = true;
    else if (this.sync || !config.async) this.run();
    else {
      this.shallow = this.queued ? shallow && this.shallow : !!shallow;
      this.queued = true;
      if (process.env.NODE_ENV !== 'production' && config.debug) {
        this.prevError = new Error('[vue] async stack trace');
      }
      // 推送到异步更新队列
      pushWatcher(this);
    }
  }

  run() {
    if (!this.active) return;

    const value = this.get();
    // 数据发生变化，
    // 或数据为对象（引用未变化，属性可能变了）
    if (value !== this.value || (isObject(value) || (this.deep && !this.shallow))) {
      const oldValue = this.value;
      this.value = value;
      const { prevError } = this;
      if (process.env.NODE_ENV !== 'production' && config.debug && prevError) {
        this.prevError = null;
        try {
          this.cb(this.vm, value, oldValue);
        } catch (error) {
          nextTick(() => {
            throw prevError;
          }, 0);
          throw error;
        }
      } else {
        this.cb(this.vm, value, oldValue);
      }
    }

    this.shallow = false;
    this.queued = this.shallow;
  }

  evaluate() {}
  depend() {}
  teardown() {}
}

/**
 * 遍历对象或数组，触发 getter
 */
function traverse(val) {
  if (isArray(val)) {
    for (const item of val) {
      traverse(item);
    }
  } else if (isObject(val)) {
    const keys = Object.keys(val);
    for (const key of keys) {
      traverse(val[key]);
    }
  }
}

export { Watcher };
