import axios from 'axios';
import StarRating from './StarRating';
import { HiSparkles } from 'react-icons/hi2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import ReviewSkelton from './ReviewSkelton';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

type GetSummaryResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const {
      mutate: handleSummarize,
      isPending: isSummarizing,
      isError: isSummaryError,
      data: summarizeResponse,
   } = useMutation<GetSummaryResponse>({
      mutationFn: () => summarizeReviews(),
   });

   const {
      data: reviewData,
      isLoading: loading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: async () => fetchReviews(),
   });

   const summarizeReviews = async () => {
      const { data } = await axios.post<GetSummaryResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };
   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (loading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkelton key={i} />
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-red-500">
            Could not fetch reviews. Try again!!!
         </div>
      );
   }

   if (reviewData?.reviews.length === 0) {
      return null;
   }

   const currentSummary = summarizeResponse?.summary || reviewData?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => handleSummarize()}
                     className="cursor-pointer"
                     disabled={isSummarizing}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {isSummarizing && (
                     <div className="py-3">
                        <ReviewSkelton />
                     </div>
                  )}
               </div>
            )}
            {isSummaryError && (
               <p className="text-red-500 mt-2">{isSummaryError}</p>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
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
