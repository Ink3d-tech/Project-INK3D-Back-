import { Module } from '@nestjs/common';
import { PerspectiveService } from './perspective.service';
import { PerspectiveController } from './perspective.controller';

@Module({
  providers: [PerspectiveService],
  controllers: [PerspectiveController],
})
export class PerspectiveModule {}
