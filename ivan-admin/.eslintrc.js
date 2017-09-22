// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    'parser': 'babel-eslint',
    'ecmaVersion': 2017,
    sourceType: 'module'
  },
  env: {
    browser: true,
    jquery: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  'settings': {
    'html/html-extensions': [
      '.html'
    ],
    'html/report-bad-indent': 'error'
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'indent': [2, 2],
    'space-before-function-paren': [2, 'always'],
    'no-console': 0,
    'no-process-env': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,

    'vue/valid-v-if': 'error',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
