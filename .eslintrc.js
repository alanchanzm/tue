module.exports = {
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-bitwise': 0,
    'import/prefer-default-export': 0,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-use-before-define': ['error', { functions: false }],
  },
};
