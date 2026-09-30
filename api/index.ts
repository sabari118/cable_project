import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let ready = false;

async function bootstrap() {
  if (!ready) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    app.enableCors({ origin: process.env.FRONTEND_URL });
    await app.init();
    ready = true;
  }
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}