import type {
  Product as ProductType,
} from '@refurtm/proto'
import { Controller, NotFoundException } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Prisma } from '@prisma/client'
import {
  Product,
} from '@refurtm/proto'
import { PrismaService } from '../prisma/prisma.service'

@Controller()
export class ProductController implements ProductType.ProductServiceController {
  constructor(private prisma: PrismaService) {}

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct({ id }: Product.GetProductRequest): Promise<Product.ProductResponse> {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }
    return { product }
  }

  @GrpcMethod('ProductService', 'GetProductBySlug')
  async getProductBySlug({ slug }: Product.GetProductBySlugRequest): Promise<Product.ProductResponse> {
    const product = await this.prisma.product.findUnique({ where: { slug } })
    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`)
    }
    return { product }
  }

  @GrpcMethod('ProductService', 'ListProducts')
  async listProducts({
    category,
    search,
    page = 1,
    limit = 10,
  }: Product.ListProductsRequest): Promise<Product.ProductList> {
    const where: Prisma.ProductWhereInput = {}

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
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ])

    return { products, total }
  }
}
