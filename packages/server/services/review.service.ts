import type { Review } from '../generated/prisma';
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
      // send then to the LLM for summarization
      const summary =
         'This is a placeholder summary. In a real implementation, you would call an LLM API here to get the summary of the reviews.';
      return summary;
   },
};
