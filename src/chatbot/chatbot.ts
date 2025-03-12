// /* eslint-disable prefer-const */
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';
// import * as dotenv from 'dotenv';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../entities/user.entity';

// dotenv.config();

// @WebSocketGateway({ cors: { origin: '*' } })
// export class Chatbot {
//   @WebSocketServer()
//   server: Server;

//   private model: GenerativeModel;

//   constructor(
//     @InjectRepository(User) private readonly userRepository: Repository<User>,
//   ) {
//     const vertexAI = new VertexAI({
//       project: process.env.GOOGLE_CLOUD_PROJECT_ID,
//       location: process.env.GOOGLE_CLOUD_REGION,
//     });

//     this.model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });
//   }

//   private readonly systemContext = `
//   Eres un chatbot llamdado INK3D, eres amigable y experto en un ecommerce basado en al web de INK3D, una tienda en línea especializada en moda asiática.
//   La pagina tambien cuenta con una sección para magazine donde se publican las ultimas tendencias de la moda y se puede interactuar en el chat. 
//   Tu objetivo es ayudar a los usuarios con información relevante y concreta.

//   📍 **Información de INK3D**:
//   - 🛍️ Catálogo: Moda asiática, ropa, accesorios y más.
//   - 📖 Revista: Últimas tendencias y consejos de moda.
//   - 🚚 Envíos: Internacionales y nacionales con entrega en 3-7 días hábiles.

//   **Reglas del chatbot:**
//   1️⃣ Responde de manera **breve y clara** (máximo 2-3 oraciones).
//   2️⃣ Si el usuario pregunta sobre productos, recomiéndale visitar el catálogo en el sitio web.
//   3️⃣ Si el usuario pregunta sobre la revista, envíale el enlace directo.
//   4️⃣ Si no sabes la respuesta, di: "Puedes contactarnos para más información."
//   `;

//   @SubscribeMessage('message')
//   async handleMessage(
//     @MessageBody()
//     data: {
//       userMessage: string;
//       userId?: number;
//       conversationHistory?: { text: string; sender: string }[];
//     },
//     @ConnectedSocket() socket: Socket,
//   ): Promise<void> {
//     try {
//       let userName = 'Usuario';

//       if (data.userId) {
//         const user = await this.userRepository.findOne({
//           where: { id: data.userId as any },
//         });
//         if (user) {
//           userName = user.name;
//         }
//       }

//       const recentHistory =
//         data.conversationHistory
//           ?.slice(-5)
//           .map(
//             (msg) =>
//               `${msg.sender === 'bot' ? 'Chatbot' : userName}: ${msg.text}`,
//           )
//           .join('\n') || '';

//       const prompt = `
//         ${this.systemContext}
//         === Historial de conversación ===
//         ${recentHistory}

//         ${userName}: ${data.userMessage}
//         Chatbot:`;

//       const result = await this.model.generateContent({
//         contents: [{ role: 'user', parts: [{ text: prompt }] }],
//       });

//       const response = await result.response;
//       let botResponse =
//         response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?';

//       this.server.to(socket.id).emit('bot-response', { text: botResponse });
//     } catch (error) {
//       console.error('Error al comunicarse con Gemini:', error);
//       console.error('🔍 Stack:', error.stack);
//       console.error('⚠️ Error completo:', JSON.stringify(error, null, 2));
//       this.server.to(socket.id).emit('bot-response', {
//         text: 'Lo siento, ocurrió un problema técnico.',
//       });
//     }
//   }
// }




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
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

dotenv.config();

// ✅ Guardar credenciales de Google Cloud en un archivo temporal si existen
const credPath = path.join(__dirname, 'google-credentials.json');

if (process.env.GOOGLE_CREDENTIALS_JSON) {
  fs.writeFileSync(credPath, process.env.GOOGLE_CREDENTIALS_JSON);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
}

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
  Eres un chatbot llamado INK3D, amigable y experto en estilos inspirados en la moda asiática, streetwear y motorsport.

  **Tu propósito:**
  
  * Asistir a los usuarios en el ecommerce INK3D, proporcionando breves consejos sobre los estilos mencionados.
  * **Orientar a los usuarios a explorar y comprar los productos de INK3D.**
  
  **Información de INK3D:**
  
  * INK3D: Tienda online que fusiona elementos de la moda asiática con streetwear y motorsport (ropa, accesorios).
  * Magazine: Tendencias y consejos sobre estos estilos.
  * Envíos: Nacionales e internacionales, 3-7 días hábiles.
  
  **Reglas estrictas:**
  
  * Respuestas breves y claras (máximo 30 palabras).
  * Primera interacción: Explica la fusión de estilos de INK3D y el magazine.
  * **No puedes redireccionar a los usuarios a ninguna parte de la aplicación.**
  * Productos: Anima a los usuarios a explorar la sección "Categorías" en la NavBar.
  * Magazine: Anima a los usuarios a explorar la sección "Magazine" en la NavBar.
  * Ayuda: El avatar tiene un menú desplegable con preguntas comunes.
  * Fuera de contexto: Si no sabes la respuesta, di: "Puedes contactarnos para más información."
  * Manten el contexto de la fusion de la moda asiatica, streatwear y motorsport, si se pregunta por otro tipo de moda, informar que solo se manejan estos estilos.
  * **Tu objetivo principal es el cierre de venta, orientando a los usuarios a comprar.**
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

      // Tomar el último historial de mensajes (máximo 5)
      const recentHistory =
        data.conversationHistory
          ?.slice(-5)
          .map(
            (msg) =>
              `${msg.sender === 'bot' ? 'Chatbot' : userName}: ${msg.text}`,
          )
          .join('\n') || '';

      // Construir el prompt para Gemini
      const prompt = `
        ${this.systemContext}
        === Historial de conversación ===
        ${recentHistory}

        ${userName}: ${data.userMessage}
        Chatbot:`;

      // Llamar a Gemini AI
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      let botResponse =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?';

      // Enviar la respuesta al usuario
      this.server.to(socket.id).emit('bot-response', { text: botResponse });
    } catch (error) {
      console.error('❌ Error al comunicarse con Gemini:', error);
      console.error('🔍 Stack:', error.stack);

      this.server.to(socket.id).emit('bot-response', {
        text: 'Lo siento, ocurrió un problema técnico. Inténtalo más tarde.',
      });
    }
  }
}
