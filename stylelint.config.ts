/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-scss'],
  rules: {
    'scss/at-rule-no-unknown': true,
    'scss/selector-no-redundant-nesting-selector': true,
  },
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
  ignoreFiles: ['apps/iprox.forms.docs/src/**/*.scss'],
};
