import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatbotService } from './chatbot.service';
import { ChatbotGateway } from './chatbot.gateway';

@Module({
  imports: [HttpModule],  
  providers: [ChatbotService, ChatbotGateway],
  exports: [ChatbotService],
})
export class ChatbotModule {}
