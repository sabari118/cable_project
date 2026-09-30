import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { env } from '@xenova/transformers';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private extractor: any;

  async onModuleInit() {
    const { pipeline } = await import('@xenova/transformers');
    env.cacheDir = '/tmp/.cache';
  env.allowLocalModels = false;
    this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const output = await this.extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data as Float32Array);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}


async findRelevantChunks(prisma: PrismaService, query: string, topN = 1) {
  const queryEmbedding = await this.generateEmbedding(query);

  const allChunks = await prisma.faqChunk.findMany();

  const scored = allChunks.map((chunk) => ({
    content: chunk.content,
    score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}
}