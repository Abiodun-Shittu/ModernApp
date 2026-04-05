import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';
import { Ollama } from 'ollama';

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const template = fs.readFileSync(
   path.join(__dirname, '.', 'prompts', 'summarize-reviews.txt'),
   'utf-8'
);

const ollamaClient = new Ollama();

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   previousRespondId?: string;
   temperature?: number;
   maxTokens?: number;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      instructions,
      previousRespondId,
      temperature = 0.2,
      maxTokens = 300,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         previous_response_id: previousRespondId,
         temperature,
         max_output_tokens: maxTokens,
      });

      return {
         id: response.id,
         text: response.output_text,
      };
   },

   async summarizeReviews(reviews: string) {
      const response = await ollamaClient.chat({
         model: 'tinyllama',
         messages: [
            {
               role: 'system',
               content: template,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });
      return response.message.content;
   },
};
