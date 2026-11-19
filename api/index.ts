import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let ready = false;

async function bootstrap() {
  if (!ready) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({ origin: process.env.FRONTEND_URL });

    const config = new DocumentBuilder()
      .setTitle('Cable API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js',
      ],
    });

    await app.init();
    ready = true;
  }
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}