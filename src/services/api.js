import axiosInstance from './axiosInstance';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error, customMessage) => {
  if (error.response) {
    // Server responded with an error status
    throw new ApiError(
      error.response.data.message || customMessage,
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request was made but no response received
    throw new ApiError(
      'No response from server. Please check your connection.',
      'NETWORK_ERROR'
    );
  } else {
    throw new ApiError(
      error.message || 'An unexpected error occurred',
      'CLIENT_ERROR'
    );
  }
};

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

// Cart API calls
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axiosInstance.post('/auth/cart', { productId, quantity });
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to add item to cart.');
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/auth/cart/${productId}`);
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to remove item from cart.');
  }
};

// Wishlist API calls
export const toggleWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post('/auth/wishlist', { productId });
    return response;
  } catch (error) {
    handleApiError(error, 'Failed to update wishlist.');
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