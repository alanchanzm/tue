/**
 * @file Vue类
 */

import * as Directives from './directives';
import * as Filters from './filters';

/**
 * 前缀
 * @const
 * @type {string}
 */
const prefix = 'vue';

const selector = Object.keys(Directives)
  .map(directive => `[${prefix}-${directive}]`)
  .join();

/**
 * @class
 */
class Vue {
  constructor(options) {
    // 自身索引，用于传递 this
    this.vm = this;
    // 根目录
    this.root = document.getElementById(options.id);
    this.els = this.root.querySelectorAll(selector);

    this.scope = {};
    this.bindings = {};

    this.init(options);
  }

  init(options) {
    this.els.forEach(el => this.processNode(el));
    this.processNode(this.root);

    const keys = Object.keys(this.bindings);
    keys.forEach(key => {
      this.scope[key] = options.scope[key];
    });
  }

  /**
   * @param {Element} el
   */
  processNode(el) {
    cloneAttributes(el.attributes).forEach(attr => {
      const directive = parseDirective(attr);
      if (directive) bindDirective(this.vm, el, this.bindings, directive);
    });
  }
}

const create = options => new Vue(options);

/**
 * Attribute 对象
 * @typedef {Object} Attribute
 * @property {string} name
 * @property {string} value
 */

/**
 * 复制 DOM 元素的 attributes
 * @param {NamedNodeMap} attributes NamedNodeMap 不是数组，不具有遍历方法；NamedNodeMap 是即时更新的
 * @return {Array.<Attribute>}
 */
function cloneAttributes(attributes) {
  return Array.prototype.map.call(attributes, ({ name, value }) => ({ name, value }));
}

/**
 * Directive 对象
 * @typedef {Object} Directive
 * @property {Attribute} attr
 * @property {string} key
 * @property {?Array.<string>} filters
 * @property {Function|Object} definition
 * @property {?string} argument
 * @property {Function} update
 */

/**
 *
 * @param {Attribute} attr 例如：{name: 'vue-class-red', value: 'msg | capitalize'}
 * @return {Directive}
 */
function parseDirective(attr) {
  const { name, value: exp } = attr;
  // 属性名是否以 prefix 打头
  if (!name.includes(prefix)) return undefined;
  const noprefix = name.slice(prefix.length + 1); // class-red

  const argIndex = noprefix.indexOf('-');
  const dirname = ~argIndex ? noprefix.slice(0, argIndex) : noprefix; // class
  const definition = Directives[dirname];

  if (!definition) return null;

  const argument = ~argIndex ? noprefix.slice(argIndex + 1) : null; // red
  const update = typeof definition === 'function' ? definition : definition.update;

  const pipeIndex = exp.indexOf('|');
  const key = ~pipeIndex ? exp.slice(0, pipeIndex).trim() : exp.trim();
  const filters = ~pipeIndex
    ? exp
        .slice(pipeIndex + 1)
        .split('|')
        .map(filter => filter.trim())
    : null;

  return { attr, key, filters, definition, argument, update };
}

/**
 *
 * @param {Vue} vue
 * @param {Element} el
 * @param {*} bindings
 * @param {Directive} directive parseDirective's return
 */
function bindDirective(vue, el, bindings, directive) {
  el.removeAttribute(directive.attr.name);
  const { key } = directive;
  if (!bindings[key]) bindings[key] = { value: undefined, directives: [] };
  const binding = bindings[key];
  directive.el = el;
  binding.directives.push(directive);
  if (directive.bind) directive.bind(el, binding.value);
  // 用 Object.prototype.hasOwnProperty.call(obj, key) 代替 obj.hasOwnProperty(key)
  // 安全原因，obj可能由 Object.create(null) 创建，原型链上没有 hasOwnProperty 方法
  if (!Object.prototype.hasOwnProperty.call(vue.scope, key)) bindAccessors(vue, key, binding);
}

function bindAccessors(vue, key, binding) {
  Object.defineProperty(vue.scope, key, {
    get() {
      return binding.value;
    },
    set(newVal) {
      binding.value = newVal;
      binding.directives.forEach(directive => {
        if (newVal && directive.filters) newVal = applyFilters(newVal, directive);
        directive.update(directive.el, newVal, directive.argument, directive, vue);
      });
    },
  });
}

/**
 *
 * @param {*} value
 * @param {Directive} directive
 */
function applyFilters(value, directive) {
  const { customFilter } = directive.definition;
  if (customFilter) return customFilter(value, directive.filters);

  return directive.filters.reduce(
    (accumulator, filter) => (Filters[filter] ? Filters[filter](accumulator) : accumulator),
    value,
  );
}

export { create, Filters as filters, Directives as directives };
