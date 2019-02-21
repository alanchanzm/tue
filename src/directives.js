/**
 * @file 指令集
 */

/**
 * 为 el.textContent 赋值
 * @param {Element} el
 * @param {string} value
 */
function text(el, value) {
  el.textContent = value || '';
}

/**
 * 显示与否
 * @param {Element} el
 * @param {any} value
 */
function show(el, value = false) {
  el.style.display = value ? '' : 'none';
}

/**
 * 添加样式
 * @param {Element} el
 * @param {any} value
 * @param {string} classname
 */
function style(el, value, classname) {
  console.log(el, value, classname);
  el.classList[value ? 'add' : 'remove'](classname);
}

/**
 * @namespace
 */
const on = {
  /**
   * 更新事件监听
   * @param {Element} el
   * @param {funtion} handler
   * @param {*} event
   * @param {*} directive
   */
  update(el, handler, event, directive) {
    if (!directive.handlers) directive.handlers = {};
    const { handlers } = directive;

    if (handlers[event]) el.removeEventListener(event, handlers[event]);

    if (handler) {
      handler = handler.bind(el);
      el.addEventListener(event, handler);
      handlers[event] = handler;
    }
  },
  /**
   *
   * @param {Element} el
   * @param {*} event
   * @param {*} directive
   */
  unbind(el, event, directive) {
    if (directive.handlers) el.removeEventListener(event, directive.handlers[event]);
  },
  /**
   * TODO
   * @param {funtion} handler
   * @param {any[]} selectors
   */
  customFilter(handler, selectors) {
    return (e, ...args) => {
      const match = selectors.every(selector => e.target.webkitMatchesSelector(selector));
      if (match) handler.apply(this, [e, ...args]);
    };
  },
};

export { text, show, style as class, on };
