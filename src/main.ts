import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as process from "node:process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrlCors = process.env.FRONTEND_URL_CORS
  app.enableCors({
    origin: frontendUrlCors, // URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('ONG Connect API')
    .setDescription('API para gerenciar eventos e voluntários')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const serverPort = process.env.PORT || '3000';
  await app.listen(serverPort).then(() => {
    console.log(`servidor rodando na porta: ${serverPort}`)
  })
}
bootstrap();
