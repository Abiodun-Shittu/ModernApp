import axios from 'axios';
import StarRating from './StarRating';
import { HiSparkles } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
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
   const [summary, setSummary] = useState('');
   const [isSummarizing, setIsSummarizing] = useState(false);

   const {
      data: reviewData,
      isLoading: loading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: async () => fetchReviews(),
   });

   const handleSummarize = async () => {
      setIsSummarizing(true);

      // Call API to get summary
      const { data } = await axios.post<GetSummaryResponse>(
         `/api/products/${productId}/reviews/summarize`
      );

      // setSummary(response.summary);
      setSummary(data.summary);
      setIsSummarizing(false);
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

   const currentSummary = summary || reviewData?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummarize}
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
