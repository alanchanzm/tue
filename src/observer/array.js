import { def } from '../util/index';

const { prototype: arrayProto } = Array;
const arrayMethods = Object.create(arrayProto);

const mutationMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
mutationMethods.forEach(function(method) {
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;

    // push、unshift、splice 会增加数组元素
    // 监测新增的元素
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2); // splice方法参数从第二项开始为新增元素
        break;
    }
    if (inserted) ob.observeArray(inserted);

    ob.dep.notify();

    return result;
  });
});

def(arrayProto, '$set', function $set(index, val) {
  if (index >= this.length) this.length = Number(index) + 1;
  return this.splice(index, 1, val)[0];
});

def(arrayProto, '$remove', function $remove(item) {
  if (!this.length) return;

  const index = this.indexOf(item);
  if (~index) return this.splice(index, 1);
});

export { arrayProto, arrayMethods };
