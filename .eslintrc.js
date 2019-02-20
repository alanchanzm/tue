module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    // 具名导出优于默认导出：更容易辨识
    'import/prefer-default-export': 'off'
  }
};
