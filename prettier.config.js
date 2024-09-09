module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: false,
  importOrder: ['@/components/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy', 'jsx', 'classProperties'],
  endOfLine: 'auto',
  printWidth: 120,
  proseWrap: 'preserve',
};
