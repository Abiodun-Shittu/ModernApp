import fs from 'fs';
import path from 'path';
import type { Review } from '../generated/prisma';
import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';

const template = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'summarize-reviews.txt'),
   'utf-8'
);

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      // Implementation for fetching reviews
      return reviewRepository.getReviews(productId);
   },
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary && new Date(existingSummary.expiresAt) > new Date()) {
         return existingSummary.content;
      }

      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const prompt = template.replace('{reviews}', joinedReviews);

      const { text: summary } = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      // Store the summary in the database with an expiration time
      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
