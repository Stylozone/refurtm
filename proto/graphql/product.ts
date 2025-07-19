import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Product {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => Float)
  price!: number

  @Field(() => String)
  imageUrl!: string

  @Field(() => String)
  condition!: string

  @Field(() => String)
  category!: string

  @Field(() => String)
  slug!: string
}

@ObjectType()
export class GetProductRequest {
  @Field(() => String)
  id!: string
}

@ObjectType()
export class GetProductBySlugRequest {
  @Field(() => String)
  slug!: string
}

@ObjectType()
export class ProductResponse {
  @Field(() => Product, { nullable: true })
  product?: Product
}

@ObjectType()
export class ListProductsRequest {
  @Field(() => String)
  category!: string

  @Field(() => String)
  search!: string

  @Field(() => Float)
  page!: number

  @Field(() => Float)
  limit!: number
}

@ObjectType()
export class ProductList {
  @Field(() => [Product])
  products!: Product[]

  @Field(() => Float)
  total!: number
}
