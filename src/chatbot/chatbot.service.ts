import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatbotService {
  private readonly huggingFaceToken: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.huggingFaceToken = this.configService.get<string>('HUGGINGFACE_TOKEN');
  }

  async getResponse(message: string, history: any[] = []): Promise<string> {
    const systemMessage = `
      Eres un chatbot amigable y conocedor para la plataforma de comercio electrónico INK3D...
      Siempre mantente amigable, profesional y servicial. Las conversaciones serán mayormente en español.
    `;
        const messages = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: message }
    ];
      (history || []).forEach(([userMessage, assistantMessage]) => {
      if (userMessage) messages.push({ role: 'user', content: userMessage });
      if (assistantMessage) messages.push({ role: 'assistant', content: assistantMessage });
    });
      const inputText = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
  
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
          {
            inputs: inputText, 
            parameters: {
              max_new_tokens: 50, 
              temperature: 0.7,
              top_p: 0.95
            }
          },
          {
            headers: {
              Authorization: `Bearer ${this.huggingFaceToken}`,
            },
          }
        )
      );
        if (response.data && response.data[0] && response.data[0].generated_text) {
        return response.data[0].generated_text.trim();
      } else {
        throw new HttpException('Error al obtener la respuesta', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      console.error('Error en la API de Hugging Face:', error);
      throw new HttpException('Error en la API de Hugging Face', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}  