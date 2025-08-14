import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../services/axiosInstance';

const initialState = {
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'fetchProducts',
  async ({ page, limit, category, q, _sort, _order, minPrice, maxPrice, rating }) => {
    const params = { page, limit };
    if (category && category !== "All") {
      params.category = category;
    }
    if (q) {
      params.q = q;
    }
    if (_sort) {
      params._sort = _sort;
      params._order = _order;
    }
    if (minPrice !== undefined) {
      params.minPrice = minPrice;
    }
    if (maxPrice !== undefined) {
      params.maxPrice = maxPrice;
    }
    if (rating !== null) {
      params.rating = rating;
    }
    // Simulate network delay
    // await new Promise(resolve => setTimeout(resolve, 10000));
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  }
);

export const productsSlice = createSlice({
  name: 'cart',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;

        // Handle pagination data if available
        if (action.payload.total !== undefined) {
          // Paginated response
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalPages = action.payload.totalPages;
        } else {
          // Non-paginated response - set default pagination values
          state.total = action.payload.products.length;
          state.page = 1;
          state.limit = action.payload.products.length;
          state.totalPages = 1;
        }
        console.log("Updated Products:", state.products);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
})


export default productsSlice.reducer