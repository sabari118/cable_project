import { Injectable } from '@nestjs/common';
import { CreateRazorpayDto } from './dto/create-razorpay.dto';
import { UpdateRazorpayDto } from './dto/update-razorpay.dto';
import Razorpay from 'razorpay'

@Injectable()
export class RazorpayService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  

  async createOrder(amount: number) {
    return this.razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
  }
}


