import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HfInference } from '@huggingface/inference';

@WebSocketGateway()
export class Chatbot {
  @WebSocketServer()
  server: Server;

  private hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

  private readonly systemContext = `
  You are a friendly and knowledgeable Chatbot for the INK3D e-commerce platform, which specializes in Asian fashion.
  INK3D offers a unique shopping experience with a dynamic catalog of clothing and accessories inspired by the latest Asian fashion trends.
  The platform not only allows users to shop for the latest fashion pieces but also provides a community space for sharing trends, opinions, and styling tips.
  In addition to the store, there is a magazine section where users can read about the latest fashion news, trends, and lifestyle updates from the world of Asian fashion.
  You help users navigate the store, answer product questions, provide fashion advice, recommend styling options, and inform them about ongoing offers, sales, and new arrivals.
  Always remain friendly, professional, and helpful. Your goal is to provide the best shopping experience and assist customers in discovering new trends and ideas in the world of Asian fashion.
  The conversations will mostly be in Spanish, so please be prepared to respond accordingly. 
  You should assist users by providing relevant product information, guiding them through the shopping process, and offering helpful advice based on their preferences and the latest fashion trends.
  Always be courteous, supportive, and clear in your responses.
  `;

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { userMessage: string, conversationHistory?: { text: string; sender: string }[] },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    try {
      const recentHistory = data.conversationHistory?.slice(-5).map(msg => 
        `${msg.sender === 'bot' ? 'Chatbot' : 'User'}: ${msg.text}`
      ).join('\n') || '';

      const prompt = `
      ${this.systemContext}

      === Conversation History ===
      ${recentHistory}

      User: ${data.userMessage}
      Chatbot:`;

      const respuesta = await this.hf.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: prompt,
        parameters: { 
          max_new_tokens: 100, 
          return_full_text: false,
          temperature: 0.7,
          top_p: 0.9, 
          stop_sequences: ["\nUser:", "\nChatbot:", "Usuario:", "Chatbot:", "### Usuario pregunta:"], 
        }
      });

      let botResponse = respuesta.generated_text.trim();

      botResponse = botResponse.split(/(\.|!|\?)\s+/)[0];

      const stopSequences = ["\nUser:", "\nChatbot:", "Usuario:", "Chatbot:"];
      stopSequences.forEach(stop => {
        if (botResponse.includes(stop)) {
          botResponse = botResponse.split(stop)[0].trim();
        }
      });

      if (!botResponse || botResponse.length < 3) {
        botResponse = "Lo siento, no entendí tu pregunta. ¿Podrías reformularla?";
      }

      this.server.to(socket.id).emit('bot-response', { text: botResponse });

    } catch (error) {
      console.error('Error al comunicarse con Hugging Face:', error);
      this.server.to(socket.id).emit('bot-response', { text: "Lo siento, ocurrió un problema." });
    }
  }
}
