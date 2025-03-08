import { Controller } from '@nestjs/common';
import { NodeMailerService } from './nodemailer.service';

@Controller('nodemailer')
export class NodemailerController {
  constructor(private readonly nodemailerService: NodeMailerService) {}
}
