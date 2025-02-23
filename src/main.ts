import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
<<<<<<< HEAD
=======
// import { SeederService } from './seeds/seeder.service';
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
=======
  // const seederService = app.get(SeederService);

  // await seederService.seed();
  // await app.close();

  app.enableCors({
    origin: '*', // Permitir el frontend
    methods: 'GET,POST,PUT,DELETE, PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  const swaggerConfig = new DocumentBuilder()
    .setTitle('The INK3D Project')
    .setDescription('Ecommerce API backend by Los chicos del barrio')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
