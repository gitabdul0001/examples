import reactPlugin from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        // ES globals
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11y
    },
    rules: {
      'jsx-a11y/anchor-is-valid': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXElement > JSXOpeningElement[name.name=\'a\']',
          message: 'Use <Link> from react-router-dom instead of <a> tags'
        }
      ]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];