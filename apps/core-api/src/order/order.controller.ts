import type { Order as OrderType } from '@refurtm/proto'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Order } from '@refurtm/proto'
import { OrderService } from './order.service'

@Controller()
export class OrderController implements OrderType.OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'Checkout')
  async checkout(request: Order.CheckoutRequest): Promise<Order.CheckoutResponse> {
    return this.orderService.checkout(request)
  }
}
