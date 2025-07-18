import { Module } from '@nestjs/common'
import { ProductServiceImpl } from './product.service'

@Module({
  providers: [ProductServiceImpl],
})
export class ProductModule {}
