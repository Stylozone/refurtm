import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ProductResolver } from './product.resolver'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: require.resolve('@refurtm/proto/dist/product.proto'),
          url: process.env.GRPC_SERVER_URL || '0.0.0.0:50051',
        },
      },
    ]),
  ],
  providers: [ProductResolver],
})
export class ProductModule {}
