import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import { llmClient } from '../llm/client';

const template = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'chatbot.txt'),
   'utf-8'
);

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{park_info}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   async sendMessage(
      conversationId: string,
      prompt: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 100,
         previousRespondId:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.text,
      };
   },
};
