import Vue from '@/core';
import { extend, inBrowser, noop } from '@/core/util';
import { directives } from './directives';
import { components } from './components';
import { patch } from './patch';

// TODO overwrite configs

// install platform runtime directives & components
extend(Vue.options.directives, directives);
extend(Vue.options.components, components);

Vue.prototype.__patch__ = inBrowser ? patch : noop;

Vue.prototype.$mount = function() {};

export default Vue;
