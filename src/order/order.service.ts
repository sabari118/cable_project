import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDto } from 'src/auth/dto/create-auth.dto';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(private prisma:PrismaService,private razorpayServeice:RazorpayService){}
  async create(channelId:string[],user:UserDto) {
    const channels=await this.prisma.channel.findMany({where:{channel_id:{in:channelId}}})

    if(!channels || channels.length === 0){
      throw new BadRequestException("channel not found ")
    }

    let totalAmount=0
    channels.forEach((channel)=>{totalAmount+=Number(channel.amount)})


    let return_amount=String(totalAmount)

    const requestRazorpay= await this.razorpayServeice.createOrder(totalAmount)

    const order=await this.prisma.order.create({data:{
      userID:user.user_id, 
      payed_amounts:return_amount,
      razorpayer_order_id:requestRazorpay.id,
      status:"PENDING",
      channel:{connect:channels.map((it)=>({channel_id:it.channel_id}))}
    },include:{channel:true}})

    return {
      order_id:order.order_id,
      amount:order.payed_amounts,
      razorpayer_order_id:order.razorpayer_order_id,
      channel_id:order.channel.map(c=>c.channel_id)
    }
  }

  async verifyPayment(dto: VerifyPaymentDto, user: UserDto) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = dto;

  // Recreate the signature using the same method Razorpay uses
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    throw new BadRequestException('Payment verification failed');
  }

  // Signature matches — genuinely paid. Update the order.
  const order = await this.prisma.order.findFirst({
    where: { razorpayer_order_id: razorpay_order_id },
  });

  if (!order) {
    throw new BadRequestException('Order not found');
  }

  const updatedOrder = await this.prisma.order.update({
    where: { order_id: order.order_id },
    data: {
      status: 'SUCCESS',
      razorpay_payment_id: razorpay_payment_id,
    },
  });

  return { success: true, order: updatedOrder };
}
async findAll() {
  const all_orders = await this.prisma.order.findMany({
    include: { channel: true },
    orderBy: { createAt: 'desc' },
  })
  return all_orders;
}

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
