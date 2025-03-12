// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { WebSocketAdapter } from './websocket.adapter';
// import * as dotenv from 'dotenv';

// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const webSocketAdapter = app.get(WebSocketAdapter);
//   app.useWebSocketAdapter(webSocketAdapter);

//   app.enableCors({
//     origin: '*',
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     allowedHeaders: 'Content-Type,Authorization',
//     credentials: true,
//   });

//   const swaggerConfig = new DocumentBuilder()
//     .setTitle('The INK3D Project')
//     .setDescription('Ecommerce API backend by Los chicos del barrio')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, swaggerConfig);
//   SwaggerModule.setup('api', app, document);

//   await app.listen(process.env.PORT ?? 3000);
//   console.log(
//     `Servidor corriendo en http://localhost:${process.env.PORT ?? 3000}`,
//   );
// }

// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WebSocketAdapter } from './websocket.adapter';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener ConfigService manualmente
  const configService = app.get(ConfigService);
  
  // PASAR `app` COMO PARÁMETRO AL ADAPTADOR DE WEBSOCKET
  const webSocketAdapter = new WebSocketAdapter(app, configService);
  app.useWebSocketAdapter(webSocketAdapter);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('The INK3D Project')
    .setDescription('Ecommerce API backend by Los chicos del barrio')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const PORT = configService.get<number>('PORT', 3000);
  await app.listen(PORT);
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}

bootstrap();
