import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication, Injectable } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebSocketAdapter extends IoAdapter {
  constructor(private app: INestApplication, private readonly configService: ConfigService) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const clientUrl = this.configService.get<string>('CLIENT_URL', 'http://localhost:3000');

    const server = super.createIOServer(port, {
      cors: {
        origin: clientUrl,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    });

    console.log(`WebSocket server running on same port as NestJS: ${port}`);
    return server;
  }
}

