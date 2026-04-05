import StarRating from './StarRating';
import { HiSparkles } from 'react-icons/hi2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import ReviewSkelton from './ReviewSkelton';
import {
   reviewsApi,
   type GetReviewsResponse,
   type GetSummaryResponse,
} from './reviewsApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation<GetSummaryResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   const reviewQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: async () => reviewsApi.fetchReviews(productId),
   });

   if (reviewQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkelton key={i} />
            ))}
         </div>
      );
   }

   if (reviewQuery.isError) {
      return (
         <div className="text-red-500">
            Could not fetch reviews. Try again!!!
         </div>
      );
   }

   if (reviewQuery.data?.reviews.length === 0) {
      return null;
   }

   const currentSummary =
      summaryMutation.data?.summary || reviewQuery.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkelton />
                     </div>
                  )}
               </div>
            )}
            {summaryMutation.isError && (
               <p className="text-red-500 mt-2">
                  Could not summarize reviews. Try again!
               </p>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
