import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { globSync } from 'glob'
import { defineConfig } from 'tsup'

export default defineConfig([{
  entry: ['gen/index.ts'], // or just 'src/product.ts' if no index
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node18',
  external: [
    '@nestjs/websockets/socket-module',
    '@nestjs/websockets',
    '@nestjs/microservices',
  ],
  onSuccess: async () => {
    const files = globSync('src/**/*.proto')
    for (const file of files) {
      const to = file.replace(/^src/, 'dist')
      mkdirSync(dirname(to), { recursive: true })
      copyFileSync(file, to)
    }
  },
}, {
  entry: ['scripts/gen-graphql-models.ts'],
  outDir: 'dist/scripts',
  format: ['cjs'],
  dts: false,
  clean: false,
  target: 'node18',
}])
