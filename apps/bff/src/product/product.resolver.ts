import { Inject, OnModuleInit } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { ClientGrpc } from '@nestjs/microservices'
import { ListProductsRequest, Product, ProductServiceClient } from '@refurtm/proto'
import { firstValueFrom } from 'rxjs'

@Resolver(() => Product)
export class ProductResolver implements OnModuleInit {
  private productService: ProductServiceClient

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceClient>('ProductService')
  }

  @Query(() => [Product])
  async products(
    @Args('category', { nullable: true }) category?: string,
    @Args('search', { nullable: true }) search?: string,
    @Args('page', { type: () => Number, defaultValue: 1 }) page = 1,
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit = 10,
  ): Promise<Product[]> {
    const req: ListProductsRequest = {
      category: category ?? '',
      search: search ?? '',
      page,
      limit,
    }
    const res = await firstValueFrom(this.productService.listProducts(req))
    return res.products
  }
}
