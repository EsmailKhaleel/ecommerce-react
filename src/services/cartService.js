import { handleApiError } from "./apiError";
import axiosInstance from "./axiosInstance";

// Cart API calls
export const addToCart = async (productId, quantity = 1, variantId) => {
  try {
    const response = await axiosInstance.post('/auth/cart', { productId, quantity, ...(variantId && { variantId }) });
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to add item to cart.');
  }
};

export const removeFromCart = async (productId, variantId) => {
  try {
    const response = await axiosInstance.delete(`/auth/cart/${productId}`, { params: variantId ? { variantId } : undefined });
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to remove item from cart.');
  }
};

export const getCart = async () => {
  try {
    const response = await axiosInstance.get('/auth/cart');
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to fetch cart.');
  }
};

export const clearCart = async () => {
  try {
    const response = await axiosInstance.delete('/auth/cart');
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to clear cart.');
  }
};
