import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { RazorpayService } from '../razorpay/razorpay.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService,PrismaService,RazorpayService],
  exports:[OrderService]
})
export class OrderModule {}
