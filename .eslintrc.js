module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'no-throw-literal': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
  ignorePatterns: ['dist/', '.eslintrc.js', 'jest.config.ts', 'src/migration', 'old'],
};
