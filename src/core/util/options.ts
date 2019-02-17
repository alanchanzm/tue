import { warn, isBuildInTag } from '@/core/util';

function mergeOptions(parent, child, vm?: IVueModel) {
  // TODO: do this for non-production
  checkComponents(child);

  if (typeof child === 'function') {
    child = child.options;
  }
}

function checkComponents(options) {
  options.component.forEach(key => validateComponentName(key));
}

function validateComponentName(name: string) {
  const nameRE = /^[A-z][\w-]*$/;
  if (!nameRE.test(name)) {
    warn(`Invalid component name: ${name}`);
  }
  if (isBuildInTag(name)) {
    warn(`Do not use built-in: ${name}`);
  }
}

export { mergeOptions, validateComponentName };
