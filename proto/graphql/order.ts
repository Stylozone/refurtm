import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CheckoutRequest {
  @Field(() => [OrderItem])
  items!: OrderItem[]
}

@ObjectType()
export class OrderItem {
  @Field(() => String)
  productId!: string

  @Field(() => Float)
  quantity!: number
}

@ObjectType()
export class CheckoutResponse {
  @Field(() => String)
  orderId!: string

  @Field(() => String)
  status!: string
}
