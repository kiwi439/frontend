import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['**/dist/**'],
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'import/extensions': 'off',
    }
  }
];
