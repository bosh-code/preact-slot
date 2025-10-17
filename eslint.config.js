import eslintJs from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  globalIgnores(['src/components/ui']),

  {
    files: ['**/*.js'],
    extends: [
      eslintJs.configs.recommended
    ]
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.recommended
    ]
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime']
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
]);
