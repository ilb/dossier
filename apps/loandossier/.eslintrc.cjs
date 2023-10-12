module.exports = {
  root: true,
  ignorePatterns: ['node_modules/*', '.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['plugin:prettier/recommended', 'plugin:jest/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        semi: true,
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'all',
        jsxBracketSameLine: true,
      },
    ],
  },
};
