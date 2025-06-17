import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToCart, removeFromCart } from '../../utils/api';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

// Async thunks
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await addToCart(productId, quantity);
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await removeFromCart(productId);
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

export const getCartAsync = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/auth/cart');
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: {
            addToCart: 'idle',
            removeFromCart: 'idle',
            getCart: 'idle'
        },
        error: null
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload;
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartAsync.pending, (state) => {
                state.status.addToCart = 'loading';
            })
            .addCase(addToCartAsync.fulfilled, (state) => {
                state.status.addToCart = 'succeeded';
                toast.success('Cart updated successfully');
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status.addToCart = 'failed';
                state.error = action.payload;
                toast.error(action.payload || 'Failed to update cart');
            })
            .addCase(removeFromCartAsync.pending, (state) => {
                state.status.removeFromCart = 'loading';
            })
            .addCase(removeFromCartAsync.fulfilled, (state) => {
                state.status.removeFromCart = 'succeeded';
                toast.success('Item removed from cart');
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.status.removeFromCart = 'failed';
                state.error = action.payload;
                toast.error(action.payload || 'Failed to remove item');
            })
            .addCase(getCartAsync.pending, (state) => {
                state.status.getCart = 'loading';
            })
            .addCase(getCartAsync.fulfilled, (state, action) => {
                state.status.getCart = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getCartAsync.rejected, (state, action) => {
                state.status.getCart = 'failed';
                state.error = action.payload;
                toast.error(action.payload || 'Failed to fetch cart');
            });
    }
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
