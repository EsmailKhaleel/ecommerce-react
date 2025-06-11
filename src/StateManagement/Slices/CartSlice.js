import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
  products: [],
  cartProducts: [],
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'fetchProducts',
  async () => {
    const response = await axiosInstance.get('/products');
    return response.data; 
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,  reducers: {
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
        state.products = action.payload.map(product => ({
            ...product,
            isFav: false,
            amount: 0
        }));
        console.log("Updated Products:", state.products);
    })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, decreaseQuantity, toggleFav, clearCart } = cartSlice.actions

export default cartSlice.reducer