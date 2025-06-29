import axios from './axiosInstance';

// Auth API calls
export const loginUser = async (email, password) => {
  const response = await axios.post('/auth/login', { email, password });
  return response;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post('/auth/register', { name, email, password });
  return response;
};

export const getCurrentUser = async () => {
  const response = await axios.get('/auth/me');
  return response;
};

// Google OAuth API calls
export const getGoogleAuthUrl = async () => {
  const response = await axios.get('/auth/google/url');
  return response;
};

export const handleGoogleCallback = async (code) => {
  const response = await axios.post('/auth/google/callback', { code });
  return response;
};

// Cart API calls
export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post('/auth/cart', { productId, quantity });
  return response;
};

export const removeFromCart = async (productId) => {
  const response = await axios.delete(`/auth/cart/${productId}`);
  return response;
};

// Wishlist API calls
export const toggleWishlist = async (productId) => {
  const response = await axios.post('/auth/wishlist', { productId });
  return response;
};
