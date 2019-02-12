module.exports = {
  parser: 'typescript-eslint-parser',
  plugins: ['typescript'],
  extends: ['eslint-config-alloy/typescript', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  root: true,
  rules: {},
};
