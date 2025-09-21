import { handleApiError } from "./apiError";
import axiosInstance from "./axiosInstance";

// Get single product details
export const getProduct = async (productId) => {
    try {
        const response = await axiosInstance.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch product details.');
    }
};
// Get Products Categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/products/categories');
    return response.data.categories;
  } catch (error) {
    handleApiError(error, 'Failed to fetch categories.');
  }
};

// Fetch products by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await axiosInstance.get(`/products?category=${category}`);
    return response.data.products;
  } catch (error) {
    handleApiError(error, 'Failed to fetch products by category.');
  }
};

// Fetch grouped products by category
export const getGroupedProducts = async () => {
  try{
  const res = await axiosInstance.get('/products/grouped');
  return res.data.categories;
  } catch (error) {
    handleApiError(error, 'Failed to fetch grouped products.');
  }
};

// Fetch related products based on category
export const getRelatedProducts = async (product) => {
  if (!product?.category) return [];
  try {
    const response = await axiosInstance.get(
      `/products?category=${product.category}&limit=10`
    );
    // Filter out the current product from related products
    const filteredProducts = response.data.products.filter((p) => p.id !== product.id);
    return filteredProducts;
  } catch (error) {
    handleApiError(error, 'Failed to fetch related products.');
  }
}