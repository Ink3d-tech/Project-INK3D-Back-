/* eslint-disable prefer-const */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

dotenv.config();

@WebSocketGateway({ cors: { origin: '*' } })
export class Chatbot {
  @WebSocketServer()
  server: Server;

  private model: GenerativeModel;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: process.env.GOOGLE_CLOUD_REGION,
    });

    this.model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  private readonly systemContext = `
  Eres un chatbot llamdado INK3D, eres amigable y experto en un ecommerce basado en al web de INK3D, una tienda en línea especializada en moda asiática.
  La pagina tambien cuenta con una sección para magazine donde se publican las ultimas tendencias de la moda y se puede interactuar en el chat. 
  Tu objetivo es ayudar a los usuarios con información relevante y concreta.

  📍 **Información de INK3D**:
  - 🛍️ Catálogo: Moda asiática, ropa, accesorios y más.
  - 📖 Revista: Últimas tendencias y consejos de moda.
  - 🚚 Envíos: Internacionales y nacionales con entrega en 3-7 días hábiles.

  **Reglas del chatbot:**
  1️⃣ Responde de manera **breve y clara** (máximo 2-3 oraciones).
  2️⃣ Si el usuario pregunta sobre productos, recomiéndale visitar el catálogo en el sitio web.
  3️⃣ Si el usuario pregunta sobre la revista, envíale el enlace directo.
  4️⃣ Si no sabes la respuesta, di: "Puedes contactarnos para más información."
  `;

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      userMessage: string;
      userId?: number;
      conversationHistory?: { text: string; sender: string }[];
    },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      let userName = 'Usuario';

      if (data.userId) {
        const user = await this.userRepository.findOne({
          where: { id: data.userId as any },
        });
        if (user) {
          userName = user.name;
        }
      }

      const recentHistory =
        data.conversationHistory
          ?.slice(-5)
          .map(
            (msg) =>
              `${msg.sender === 'bot' ? 'Chatbot' : userName}: ${msg.text}`,
          )
          .join('\n') || '';

      const prompt = `
        ${this.systemContext}
        === Historial de conversación ===
        ${recentHistory}

        ${userName}: ${data.userMessage}
        Chatbot:`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      let botResponse =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?';

      this.server.to(socket.id).emit('bot-response', { text: botResponse });
    } catch (error) {
      console.error('Error al comunicarse con Gemini:', error);
      this.server.to(socket.id).emit('bot-response', {
        text: 'Lo siento, ocurrió un problema técnico.',
      });
    }
  }
}
