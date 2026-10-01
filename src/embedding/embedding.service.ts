import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string,
) => Promise<any>;

@Injectable()
export class EmbeddingService {
  private extractor: any;

  private async getExtractor() {
    if (!this.extractor) {
      const { pipeline, env } = await dynamicImport('@xenova/transformers');
      env.cacheDir = '/tmp/.cache';
      env.useFSCache = false;
      env.allowLocalModels = false;
      this.extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
      );
    }
    return this.extractor;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const extractor = await this.getExtractor();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
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