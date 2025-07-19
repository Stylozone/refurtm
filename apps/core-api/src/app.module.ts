import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from './product/product.module'

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
