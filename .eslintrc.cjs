/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  globals: {
    __DEV__: 'readonly',
    __TDT_KEY__: 'readonly',
    __TDT_SUBDOMAINS__: 'readonly',
    __CESIUM_BASE_URL__: 'readonly'
  }
}
