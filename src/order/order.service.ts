import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from 'src/auth/dto/create-auth.dto';
import { RazorpayService } from 'src/razorpay/razorpay.service';

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

  findAll() {
    return `This action returns all order`;
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
