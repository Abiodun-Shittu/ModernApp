import Skeleton from 'react-loading-skeleton';
const ReviewSkelton = () => {
   return (
      <div>
         <Skeleton width={150} />
         <Skeleton height={100} />
         <Skeleton count={2} />
      </div>
   );
};

export default ReviewSkelton;
