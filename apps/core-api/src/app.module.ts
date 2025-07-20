import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OrderModule } from './order/order.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProductModule } from './product/product.module'

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
