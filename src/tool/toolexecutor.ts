import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { OrderService } from "src/order/order.service";

@Injectable()
export class ToolsExecutorService {
    constructor( private readonly prisma:PrismaService,private readonly orderService:OrderService){}

async getChannels(){
  const channel=await this.prisma.channel.findMany({
    select:{
      channel_id:true,
      name:true,
      amount:true
    }
  })
  return channel;
}

async subscribeChannel(channelId:any,user:any){
   try{
    const result= await this.orderService.create(channelId,user)
    return {
       success: true,
        message: 'Order created successfully. Please complete payment.',
        order_id: result.order_id,
        amount: result.amount,
        razorpay_order_id: result.razorpayer_order_id,
    }
   } catch (error: unknown) {
     return {
       success: false,
       message: error instanceof Error ? error.message : 'Failed to create order',
     };
   }
}

async checkUserSubscription(channelId: string, user_id: string) {
  try {
    const existingOrder = await this.prisma.order.findFirst({
      where: {
        userID: user_id,
        status: 'SUCCESS',
        channel: { some: { channel_id: channelId } },
      },
    });

    return {
      subscribed: !!existingOrder,
      message: existingOrder
        ? 'User is already subscribed to this channel.'
        : 'User is not subscribed to this channel yet.',
    };
  } catch (error) {
    console.error('checkUserSubscription failed:', error);
    return {
      subscribed: false,
      message: 'Could not verify subscription status due to an error.',
    };
  }
}
} 





