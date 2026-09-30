import { Module } from '@nestjs/common';
import { AttachementService } from './attachement.service';
import { AttachementController } from './attachement.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [AttachementController],
  providers: [AttachementService,PrismaService,AwsService],
})
export class AttachementModule {}
