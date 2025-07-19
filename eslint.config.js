import { join } from 'node:path'
import configs from '@phaicom/eslint-config'
import globals from 'globals'

export default
configs(
  {
    tailwind: true,
    formatters: {
      html: true,
      css: true,
    },
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },
  {
    files: ['./apps/core-api/**/*.{js,ts}', './apps/bff/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        project: [
          './apps/core-api/tsconfig.json',
          './apps/bff/tsconfig.json',
        ],
        tsconfigRootDir: join(import.meta.dirname, './'),
      },
    },
    rules: {
      'n/prefer-global/process': 'off',
    },
  },
)
