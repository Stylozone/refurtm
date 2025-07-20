import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { OrderResolver } from './order.resolver'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: require.resolve('@refurtm/proto/dist/order.proto'),
          url: process.env.GRPC_SERVER_URL || '0.0.0.0:50051',
        },
      },
    ]),
  ],
  providers: [OrderResolver],
})
export class OrderModule {}
