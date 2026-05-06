import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [AuthModule, OrderModule, RazorpayModule, FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
