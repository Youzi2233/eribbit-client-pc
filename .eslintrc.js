module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-dangle': ['off', 'always-multiline'],
    semi: ['off', 'always'],
    'no-unused-vars': 'off',
    'space-before-function-paren': ['off'],
    'dot-notation': ['off'],
    'vue/multi-word-component-names': ['off'],
  },
};
