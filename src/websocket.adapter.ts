import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class WebSocketAdapter extends IoAdapter {
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    super();
    this.configService = configService;
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

    console.log(`WebSocket server running on port ${port}, allowing connections from ${clientUrl}`);
    return server;
  }
}
