import { NestFactory } from '@nestjs/core';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppModule } from 'src/app.module';

const faqChunks = [
  'Subscription pricing: SPORTS is ₹100, MOVIES is ₹150, KIDS is ₹80, NEWS is ₹50, MUSIC is ₹70.',
  'To cancel your subscription, go to Settings > Billing > Manage Plan, then click Cancel.',
  'We support payment via UPI, credit card, debit card, and net banking.',
  'To subscribe to a channel, just tell the assistant which channel you want, and it will create an order for you.',
];

async function seed() {
  // boots your Nest app in the background (no HTTP server), giving you real DI instances
  const app = await NestFactory.createApplicationContext(AppModule);

  const prisma = app.get(PrismaService);
  const embeddingService = app.get(EmbeddingService);

  for (const content of faqChunks) {
    console.log('Embedding:', content);
    const embedding = await embeddingService.generateEmbedding(content);
    await prisma.faqChunk.create({
      data: { content, embedding },
    });
  }

  console.log('✅ FAQ chunks seeded with embeddings.');

  await app.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });