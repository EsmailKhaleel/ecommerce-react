import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  cartProducts: [],
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'fetchProducts',
  async ({ page, limit, category, q, _sort, _order, minPrice, maxPrice }) => {
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
    // Simulate network delay
    // await new Promise(resolve => setTimeout(resolve, 10000));
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState, reducers: {
    clearCart: (state) => {
      state.cartProducts = [];
    },
    addToCart: (state, action) => {
      const existingProduct = state.cartProducts.find(product => product.id === action.payload.id);
      if (existingProduct) {
        existingProduct.amount += 1;
      } else {
        state.cartProducts.push({
          ...action.payload,
          amount: 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cartProducts = state.cartProducts.filter(product => product.id !== action.payload);
    },
    decreaseQuantity: (state, action) => {
      const product = state.cartProducts.find(product => product.id === action.payload);
      if (product) {
        if (product.amount > 1) {
          product.amount -= 1;
        } else {
          state.cartProducts = state.cartProducts.filter(product => product.id !== action.payload);
        }
      }
    },
    toggleFav: (state, action) => {
      const productId = action.payload;

      const productInList = state.products.find(product => product.id === productId);
      if (productInList) {
        productInList.isFav = !productInList.isFav;
      }
      const productInCart = state.cartProducts.find(product => product.id === productId);
      if (productInCart) {
        productInCart.isFav = !productInCart.isFav;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products.map(product => ({
          ...product,
          isFav: false,
          amount: 0
        }));

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
      });
  },
})

export const { addToCart, removeFromCart, decreaseQuantity, toggleFav, clearCart } = cartSlice.actions

export default cartSlice.reducer