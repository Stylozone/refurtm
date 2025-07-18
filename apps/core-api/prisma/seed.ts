/* eslint-disable no-console */
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()

  const products = Array.from({ length: 20 }).map(() => {
    const title = faker.commerce.productName()
    return {
      title,
      description: faker.commerce.productDescription(),
      price: Number.parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
      imageUrl: faker.image.urlPicsumPhotos(),
      condition: faker.helpers.arrayElement(['Excellent', 'Good', 'Fair']),
      category: faker.helpers.arrayElement(['Phone', 'Laptop', 'Tablet']),
      slug: `${faker.helpers.slugify(title.toLowerCase())}-${faker.string.alphanumeric(4)}`,
    }
  })

  await prisma.product.createMany({ data: products })
  console.log('✅ Seeded products')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
