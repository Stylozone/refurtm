import { Inject, OnModuleInit } from '@nestjs/common'
import { Args, Field, Float, InputType, Mutation, Resolver } from '@nestjs/graphql'
import { ClientGrpc } from '@nestjs/microservices'
import { GQLModels, Order } from '@refurtm/proto'
import { firstValueFrom } from 'rxjs'

@InputType()
export class OrderItemInput {
  @Field(() => String)
  productId!: string

  @Field(() => Float)
  quantity!: number
}

@Resolver()
export class OrderResolver implements OnModuleInit {
  private orderService!: Order.OrderServiceClient

  constructor(
    @Inject('ORDER_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService = this.client.getService<Order.OrderServiceClient>('OrderService')
  }

  @Mutation(() => GQLModels.CheckoutResponse)
  async checkout(
    @Args({ name: 'items', type: () => [OrderItemInput] }) items: OrderItemInput[],
  ): Promise<GQLModels.CheckoutResponse> {
    const res = await firstValueFrom(this.orderService.checkout({ items }))
    return res ?? null
  }
}
