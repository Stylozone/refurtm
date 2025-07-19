import { Inject, OnModuleInit } from '@nestjs/common'
import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { ClientGrpc } from '@nestjs/microservices'
import {
  GQLModels,
  ListProductsRequest,
  ProductServiceClient,
} from '@refurtm/proto'

import { firstValueFrom } from 'rxjs'

@Resolver(() => GQLModels.Product)
export class ProductResolver implements OnModuleInit {
  private productService!: ProductServiceClient

  constructor(@Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceClient>('ProductService')
  }

  @Query(() => GQLModels.ProductList)
  async products(
    @Args('category', { nullable: true }) category?: string,
    @Args('search', { nullable: true }) search?: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page = 1,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit = 10,
  ): Promise<GQLModels.ProductList> {
    const req: ListProductsRequest = {
      category: category ?? '',
      search: search ?? '',
      page,
      limit,
    }

    const res = await firstValueFrom(this.productService.listProducts(req))
    return {
      products: res.products ?? [],
      total: res.total ?? 0,
    }
  }
}
