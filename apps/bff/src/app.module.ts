import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { OrderModule } from './order/order.module'
import { ProductModule } from './product/product.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // or a path like 'schema.gql'
    }),
    ProductModule,
    OrderModule,
  ],
})
export class AppModule {}
