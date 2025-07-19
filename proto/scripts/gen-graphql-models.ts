import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { globSync } from 'glob'

const GENERATED_DIR = 'gen'
const OUTPUT_DIR = 'dist/graphql-models'

// Ensure output folder exists
mkdirSync(OUTPUT_DIR, { recursive: true })

// Read all generated .ts files (skip index if any)
const files = globSync(`${GENERATED_DIR}/*.ts`).filter((f) => !f.endsWith('index.ts'))

const indexExports: string[] = []

for (const file of files) {
  const content = readFileSync(file, 'utf-8')
  const filename = basename(file)
  const outputFile = join(OUTPUT_DIR, filename)

  let output = `import { ObjectType, Field, Int, Float } from '@nestjs/graphql'\n\n`

  const interfaces = [...content.matchAll(/export interface (\w+) \{([^}]+)\}/g)]

  for (const match of interfaces) {
    const name = match[1]
    const body = match[2]
    output += `@ObjectType()\nexport class ${name} {\n`

    for (const line of body.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('//')) {
        continue
      }

      const [rawKey, rawType] = trimmed.split(':').map((s) => s.trim().replace(/;$/, ''))
      const key = rawKey
      const type = rawType || 'string'

      // Guess decorator
      let gqlType = 'String'
      if (type === 'number') {
        gqlType = 'Float'
      }
      else if (type === 'boolean') {
        gqlType = 'Boolean'
      }
      else if (type === 'string') {
        gqlType = 'String'
      }
      else if (type.startsWith('number[]')) {
        gqlType = '[Float]'
      }
      else if (type.startsWith('string[]')) {
        gqlType = '[String]'
      }
      else if (type.endsWith('[]')) {
        gqlType = `[${type.replace('[]', '')}]`
      }
      else { gqlType = type }

      output += `  @Field(() => ${gqlType})\n`
      output += `  ${key}: ${type};\n`
    }

    output += '}\n\n'
    const exportPath = `export * from './${filename.replace('.ts', '')}'`
    if (!indexExports.includes(exportPath)) {
      indexExports.push(exportPath)
    }
  }

  writeFileSync(outputFile, output, 'utf-8')
}

// Generate index.ts
writeFileSync(join(OUTPUT_DIR, 'index.ts'), indexExports.join('\n'))
console.log(`✅ GraphQL models generated in ${OUTPUT_DIR}`)
