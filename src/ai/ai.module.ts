import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderModule } from 'src/order/order.module';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { ToolModule } from 'src/tool/tool.module';
import { ToolsExecutorService } from 'src/tool/toolexecutor';

@Module({
  imports:[OrderModule,ToolModule],
  controllers: [AiController],
  providers: [AiService,PrismaService,EmbeddingService,ToolsExecutorService],
})
export class AiModule {}
