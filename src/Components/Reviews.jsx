import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiStar, BiSolidStar } from 'react-icons/bi';
import { useAuth } from '../Context/useAuth';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useReviews } from '../hooks/reviews/useReviews';
import { useReviewMutation } from '../hooks/reviews/useReviewMutation';

function Reviews({ productId }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // Fetch reviews with optimized query config
    const { data: reviews , isLoading: isLoadingReviews } = useReviews(productId);

    // Add review mutation
    const addReviewMutation = useReviewMutation(productId);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error(t('reviews.loginRequired'));
            return;
        }
        addReviewMutation.mutate({
            productId,
            rating,
            comment,
            userName: user.name || 'Anonymous',
        }, {
            onSuccess: () => {
                toast.success(t('reviews.submitted'));
                setComment('');
                setRating(5);
            },
            onError: () => {
                toast.error(t('reviews.error'));
            }
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
        <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 space-y-8"
        >
            <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('reviews.yourRating')}
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
                        {t('reviews.yourReview')}
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="max-h-[200px] min-h-[100px] w-full dark:text-gray-100 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-800 focus:outline-none"
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
                    {addReviewMutation.isLoading ? t('reviews.submitting') : t('reviews.submitReview')}
                </motion.button>
            </form>

            {/* Reviews List */}
            {reviews.length > 0 && <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {t('reviews.customerReviews')}
                </h3>
                <AnimatePresence>
                    {reviews.map((review) => (
                        <motion.div
                            key={review._id}
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
            }
        </motion.section>
    );
}

export default Reviews; 