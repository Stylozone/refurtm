import { Injectable } from '@nestjs/common'
import { Order } from '@refurtm/proto'
import { v4 as uuidv4 } from 'uuid'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async checkout(data: Order.CheckoutRequest): Promise<Order.CheckoutResponse> {
    const orderId = uuidv4()

    await this.prisma.order.create({
      data: {
        id: orderId,
        status: 'CONFIRMED',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    })

    return {
      orderId,
      status: 'CONFIRMED',
    }
  }
}
