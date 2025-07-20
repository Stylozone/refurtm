import type { MicroserviceOptions } from '@nestjs/microservices'
import { ReflectionService } from '@grpc/reflection'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { protoPath as healthCheckProtoPath, HealthImplementation } from 'grpc-health-check'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: ['product', 'order'],
      protoPath: [
        healthCheckProtoPath,
        require.resolve('@refurtm/proto/dist/product.proto'),
        require.resolve('@refurtm/proto/dist/order.proto'),
      ],
      url: `0.0.0.0:${process.env.GRPC_PORT}`,
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server)
        const healthImpl = new HealthImplementation({
          '': 'UNKNOWN',
        })

        healthImpl.addToServer(server)
        healthImpl.setStatus('', 'SERVING')
      },
    },
  })
  await app.listen()
}
bootstrap()
