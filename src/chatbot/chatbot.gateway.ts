import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatbotService } from './chatbot.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class ChatbotGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatbotService: ChatbotService,
    private configService: ConfigService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: { text: string, history: any[] }) {
    try {
      const { text, history } = payload;

      const token = this.configService.get<string>('HUGGINGFACE_TOKEN');
      
      const response = await this.chatbotService.getResponse(text, history);
      
      this.server.emit('bot-response', { text: response });
    } catch (error) {
      console.error('Error en el gateway:', error);
      this.server.emit('bot-response', { text: 'Lo siento, ocurrió un error.' });
    }
  }
}
