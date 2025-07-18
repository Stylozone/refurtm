import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { GetProductBySlugRequest, GetProductRequest, ListProductsRequest, ProductList, ProductResponse, ProductServiceController } from './product'

@Injectable()
export class ProductServiceImpl implements ProductServiceController {
  private prisma = new PrismaClient()

  async getProduct({ id }: GetProductRequest): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }
    return { product }
  }

  async getProductBySlug({ slug }: GetProductBySlugRequest): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({ where: { slug } })
    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`)
    }

    return { product }
  }

  async listProducts({ category, search, page = 1, limit = 10 }: ListProductsRequest): Promise<ProductList> {
    const where: any = {}

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive' as const,
      }
    }

    if (category) {
      where.category = category
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit }),
      this.prisma.product.count({ where }),
    ])

    return { products, total }
  }
}
