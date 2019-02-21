module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    // 具名导出优于默认导出：更容易辨识
    'import/prefer-default-export': 'off',
    // 省略箭头函数中不必要的括号
    'arrow-parens': [2, 'as-needed'],
    // 允许对函数参数赋值
    'no-param-reassign': 'off',
    // 函数变量提升
    'no-use-before-define': ['error', { functions: false }],
    // 对象换行
    'object-curly-newline': ['error', { multiline: true }],
    // 位运算符
    'no-bitwise': 'off',
    // 取消缩进检测，由 Prettier 控制
    indent: 'off',
  },
};
