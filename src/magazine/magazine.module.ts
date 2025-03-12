import { Module } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { MagazineController } from './magazine.controller';
import { MagazineGateway } from './magazine.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Magazine } from 'src/entities/magazine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Magazine])],
  controllers: [MagazineController],
  providers: [MagazineService, MagazineGateway],
})
export class MagazineModule {}
