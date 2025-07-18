import type { MicroserviceOptions } from '@nestjs/microservices'
import { join } from 'node:path'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'product',
      protoPath: join(__dirname, '../proto/product.proto'),
      url: '0.0.0.0:50051',
    },
  })
  await app.listen()
}
bootstrap()
