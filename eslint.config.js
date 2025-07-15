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
  },
  {
    files: ['./apps/api/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: join(import.meta.dirname, './apps/api'),
      },
    },
    rules: {
      'n/prefer-global/process': 'off',
    },
  },
)
