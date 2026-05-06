import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'prisma/prisma.service';
import { RazorpayService } from 'src/razorpay/razorpay.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService,PrismaService,RazorpayService],
})
export class OrderModule {}
