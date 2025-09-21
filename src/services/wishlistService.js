import { handleApiError } from "./apiError";
import axiosInstance from "./axiosInstance";

// Wishlist API calls
export const toggleWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post('/auth/wishlist', { productId });
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to update wishlist.');
  }
};

export const getWishlist = async () => {
  try {
    const response = await axiosInstance.get('/auth/wishlist');
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to fetch wishlist.');
  }
};

export const clearWishlist = async () => {
  try {
    const response = await axiosInstance.delete('/auth/wishlist');
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to clear wishlist.');
  }
};