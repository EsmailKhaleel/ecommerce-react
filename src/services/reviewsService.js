import { handleApiError } from "./apiError";
import axiosInstance from "./axiosInstance";

export const getProductReviews = async (productId) => {
  try {
    const response = await axiosInstance.get(`/reviews?productId=${productId}`);
    return response.data.reviews;
  } catch (error) {
    handleApiError(error, 'Failed to fetch product reviews.');
  }
};

export const addReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to add review.');
  }
};