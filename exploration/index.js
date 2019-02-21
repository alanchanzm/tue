const bindingMark = 'data-vue-binding';

class Vue {
  constructor(id, initData) {
    this.bindings = {};
    this.data = {};
    this.initData = initData;

    this.el = document.querySelector(`#${id}`);
    const markToken = this.markToken.bind(this);
    const content = this.el.innerHTML.replace(/{{(.*)}}/g, markToken);
    this.el.innerHTML = content;

    this.init();
  }

  init() {
    const variables = Object.keys(this.bindings);
    variables.forEach(variable => this.bind(variable));

    if (this.initData) Object.assign(this.data, this.initData);
  }

  /**
   * 为模板添加相应的标记
   * @param {*} _ useless 占位符
   * @param {string} variable 模板字符串
   * @returns {string} <span data-vue-binding="xxx"></span>
   */
  markToken(_, variable) {
    variable = variable.trim();
    this.bindings[variable] = {};
    return `<span ${bindingMark}="${variable}"></span>`;
  }

  /**
   * 拦截 this.data 的变化，修改对应的 DOM
   * @param {string} variable 模板字符串
   */
  bind(variable) {
    // 这是一个 NodeList，不是数组，不具有数组方法
    this.bindings[variable].els = this.el.querySelectorAll(`[${bindingMark}="${variable}"]`);
    // NodeList 的 forEach 是一个类似于 Array.prototype.forEach 的方法
    this.bindings[variable].els.forEach(element => element.removeAttribute(bindingMark));

    const get = () => this.bindings[variable].value;
    const set = newVal => {
      this.bindings[variable].els.forEach(element => {
        element.textContent = newVal;
        this.bindings[variable].value = newVal;
      });
    };

    Object.defineProperty(this.data, variable, { get, set });
  }
}

const app = new Vue('test', {
  msg: 'hello',
});

setTimeout(() => {
  app.data.what = 'what';
  app.data.hey = 'hey';
  app.data.msg = 'goodbye';
}, 1000);
