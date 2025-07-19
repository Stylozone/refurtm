import type { MicroserviceOptions } from '@nestjs/microservices'
import { ReflectionService } from '@grpc/reflection'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'product',
      protoPath: require.resolve('@refurtm/proto/product.proto'),
      url: '0.0.0.0:50051',
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server)
      },
    },
  })
  await app.listen()
}
bootstrap()
