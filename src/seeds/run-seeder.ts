import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  await seederService.seed();
  console.log('Seeding completo.');
  await app.close();
}

runSeeder();
