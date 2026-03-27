import type { Review } from '../generated/prisma';
import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      // Implementation for fetching reviews
      return reviewRepository.getReviews(productId);
   },
   async summarizeReviews(productId: number): Promise<string> {
      // Implementation for summarizing reviews
      // Get the last 10 reviews for the product
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = `Summarize the following customer reviews into a short paragraph highlighting the key themes, both positive and negative: ${joinedReviews}`;

      const response = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      return response.text;
   },
};
