import type { Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      // Implementation for fetching reviews
      return reviewRepository.getReviews(productId);
   },
};
