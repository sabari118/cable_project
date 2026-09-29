import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';

async function testSearch() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const prisma = app.get(PrismaService);
  const embeddingService = app.get(EmbeddingService);

  const query = 'how much for subscription';

  console.log('Query:', query);

  const results = await embeddingService.findRelevantChunks(prisma, query, 2);

  console.log('Results:');
  console.log(results);

  await app.close();
}

testSearch()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Search test failed:', err);
    process.exit(1);
  });