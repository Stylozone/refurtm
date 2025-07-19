import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { globSync } from 'glob'

const GENERATED_DIR = 'gen'
const OUTPUT_DIR = 'graphql'

mkdirSync(OUTPUT_DIR, { recursive: true })

const files = globSync(`${GENERATED_DIR}/*.ts`).filter((f) => !f.endsWith('index.ts'))

const indexExports: string[] = []

for (const file of files) {
  const content = readFileSync(file, 'utf-8')
  const filename = basename(file)
  const outputFile = join(OUTPUT_DIR, filename)

  const usedImports = new Set<string>()
  const classParts: string[] = []

  const interfaces = [...content.matchAll(/export interface (\w+) \{([^}]+)\}/g)]

  for (const match of interfaces) {
    const name = match[1]
    const body = match[2]
    const lines = body.split('\n').map((line) => line.trim()).filter(Boolean)

    // Skip interfaces with functions
    if (lines.some((line) => /\w+\s*\(.*\)\s*[:;]/.test(line))) {
      console.warn(`⚠️  Skipping interface "${name}" because it contains methods`)
      continue
    }

    usedImports.add('ObjectType')
    let classDef = `@ObjectType()\nexport class ${name} {\n`

    for (const line of lines) {
      if (
        line.startsWith('//')
        || line.startsWith('/*')
        || line.startsWith('*')
        || line.startsWith('/**')
      ) {
        continue
      }

      const [rawKey, rawType] = line.split(':').map((s) => s.trim().replace(/;$/, ''))
      if (!rawKey || !rawType) {
        continue
      }

      const key = rawKey
      let type = rawType
      let gqlType = 'String'
      let nullable = false

      if (type.includes('undefined') || type.includes('null')) {
        nullable = true
        type = type.replace(/\s*\|\s*undefined/g, '').replace(/\s*\|\s*null/g, '').trim()
      }

      if (type === 'number') {
        gqlType = 'Float'
        usedImports.add('Float')
      }
      else if (type === 'boolean') {
        gqlType = 'Boolean'
      }
      else if (type === 'string') {
        gqlType = 'String'
      }
      else if (type.endsWith('[]')) {
        const inner = type.replace('[]', '')
        gqlType = `[${inner}]`
      }
      else {
        gqlType = type
      }

      gqlType = gqlType.replace(/[()]/g, '')
      usedImports.add('Field')

      classDef += `  @Field(() => ${gqlType}${nullable ? ', { nullable: true }' : ''})\n`
      classDef += `  ${key}${nullable ? '?' : '!'}: ${type};\n`
    }

    classDef += '}\n\n'
    classParts.push(classDef)

    const exportPath = `export * from './${filename.replace('.ts', '')}'`
    if (!indexExports.includes(exportPath)) {
      indexExports.push(exportPath)
    }
  }

  const importLine
    = usedImports.size > 0
      ? `import { ${Array.from(usedImports).sort().join(', ')} } from '@nestjs/graphql'\n\n`
      : ''

  writeFileSync(outputFile, importLine + classParts.join(''), 'utf-8')
}

writeFileSync(join(OUTPUT_DIR, 'index.ts'), indexExports.join('\n'))
console.log(`✅ GraphQL models generated in ${OUTPUT_DIR}`)
