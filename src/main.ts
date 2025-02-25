import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WebSocketAdapter } from './websocket.adapter';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const clientUrl = configService.get<string>('CLIENT_URL', 'http://localhost:3000');
  app.enableCors({
    origin: clientUrl,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.useWebSocketAdapter(new WebSocketAdapter(configService));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('The INK3D Project')
    .setDescription('Ecommerce API backend by Los chicos del barrio')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();

