import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

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

   async summarize(text: string) {
      const output = await inferenceClient.summarization({
         model: 'facebook/bart-large-cnn',
         inputs: text,
         provider: 'hf-inference',
      });

      return output.summary_text;
   },
};
