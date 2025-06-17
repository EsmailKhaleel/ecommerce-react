import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { BiStar, BiSolidStar } from 'react-icons/bi';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../Context/useAuth';
import { toast } from 'react-toastify';

function Reviews({ productId }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const queryClient = useQueryClient();

    // Fetch reviews with optimized query config
    const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/reviews?productId=${productId}`);
            return data;
        },
        staleTime: 30000,
        cacheTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Add review mutation
    const addReviewMutation = useMutation({
        mutationFn: async (reviewData) => {
            const { data } = await axiosInstance.post('/reviews', reviewData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['reviews', productId]);
            queryClient.invalidateQueries(['productRating', productId]);
            setComment('');
            setRating(5);
            setUserName('');
        },
    });

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You must be logged in to submit a review');
            return;
        }
        if (!userName.trim()) {
            toast.error('Please enter your name');
            return;
        }
        addReviewMutation.mutate({
            productId,
            rating,
            comment,
            userName,
        });
    };

    if (isLoadingReviews) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-3">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Rating
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="text-2xl focus:outline-none"
                            >
                                {star <= rating ? (
                                    <BiSolidStar className="text-primary" />
                                ) : (
                                    <BiStar className="text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full dark:text-gray-100 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-800 focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Review
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full dark:text-gray-100 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-800 focus:outline-none"
                        rows="4"
                        required
                    />
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={addReviewMutation.isLoading}
                    className="text-accent border border-accent hover:bg-accent hover:text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {addReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                </motion.button>
            </form>

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Customer Reviews
                </h3>
                <AnimatePresence>
                    {reviewsData?.reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {review.userName}
                                    </span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, index) => (
                                            <span key={index} className="text-amber-400">
                                                {index < review.rating ? (
                                                    <BiSolidStar />
                                                ) : (
                                                    <BiStar />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Reviews; 