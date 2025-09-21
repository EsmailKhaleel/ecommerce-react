import { handleApiError } from './apiError';
import axiosInstance from './axiosInstance';

// Auth API calls
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response;
  } catch (error) {
    handleApiError(error, 'Login failed. Please check your credentials.');
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response;
  } catch (error) {
    handleApiError(error, 'Registration failed. Please try again.');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to fetch user information.');
  }
};

// Google OAuth API calls
export const getGoogleAuthUrl = async () => {
  try {
    const response = await axiosInstance.get('/auth/google/url');
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to get Google authentication URL.');
  }
};

export const handleGoogleCallback = async (code) => {
  try {
    const response = await axiosInstance.post('/auth/google/callback', { code });
    return response;
  } catch (error) {
    handleApiError(error, 'Google authentication failed.');
  }
};

// Create Checkout Session
export const createCheckoutSession = async (cartItems, user) => {
  try {
    const response = await axiosInstance.post(
        "/stripe/create-checkout-session",
        {
          userId: user._id,
          email: user.email,
          products: cartItems.map((item) => ({
            id: item.product.id,
            amount: item.quantity,
          })),
        }
      );
      return response;
  } catch (error) {
    handleApiError(error, 'Failed to create checkout session.');
  }
}