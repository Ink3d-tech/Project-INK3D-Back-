import { Module } from '@nestjs/common';

import { NodemailerController } from './nodemailer.controller';
import { NodeMailerService } from './nodemailer.service';

@Module({
  controllers: [NodemailerController],
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class NodemailerModule {}
