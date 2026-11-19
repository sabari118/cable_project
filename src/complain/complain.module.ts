import { Module } from '@nestjs/common';
import { ComplainService } from './complain.service';
import { ComplainController } from './complain.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ComplainController],
  providers: [ComplainService,PrismaService],
})
export class ComplainModule {}
