import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { AddressModule } from './address/address.module';
import { AiModule } from './ai/ai.module';
import { AttachementModule } from './attachement/attachement.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','..', 'public'),
      serveRoot: '/',
    }),
    AuthModule, OrderModule, RazorpayModule, AddressModule, AiModule,
    AttachementModule, EmbeddingModule, ChannelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}