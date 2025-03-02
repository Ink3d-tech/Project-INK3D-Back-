import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { MagazineService } from './magazine.service';

@WebSocketGateway()
export class MagazineGateway {
  constructor(private readonly magazineService: MagazineService) {}

  @SubscribeMessage('findAllMagazines')
  findAll() {
    return this.magazineService.findAll();
  }
}
