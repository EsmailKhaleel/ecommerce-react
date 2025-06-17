import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Async thunks
export const getWishlistAsync = createAsyncThunk(
    'wishlist/getWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/auth/wishlist');
            return response.data.wishlist;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const toggleWishlistItemAsync = createAsyncThunk(
    'wishlist/toggleItem',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/wishlist', { productId });
            return {
                items: response.data.wishlist,
                message: response.data.message,
                productId // Return the productId to track which product was toggled
            };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to update wishlist',
                productId 
            });
        }
    }
);

export const clearWishlistAsync = createAsyncThunk(
    'wishlist/clearWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/auth/wishlist');
            return {
                items: response.data.wishlist,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        status: {
            getWishlist: 'idle',
            clearWishlist: 'idle'
        },
        loadingItems: {}, // Track loading state per product
        error: null,
        message: null
    },
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Wishlist
            .addCase(getWishlistAsync.pending, (state) => {
                state.status.getWishlist = 'loading';
                state.error = null;
            })
            .addCase(getWishlistAsync.fulfilled, (state, action) => {
                state.status.getWishlist = 'succeeded';
                state.items = action.payload;
                state.error = null;
            })
            .addCase(getWishlistAsync.rejected, (state, action) => {
                state.status.getWishlist = 'failed';
                state.error = action.payload;
            })
            // Toggle Wishlist Item
            .addCase(toggleWishlistItemAsync.pending, (state, action) => {
                // Set loading state for specific product
                state.loadingItems[action.meta.arg] = true;
                state.error = null;
                state.message = null;
            })
            .addCase(toggleWishlistItemAsync.fulfilled, (state, action) => {
                // Clear loading state for specific product
                delete state.loadingItems[action.payload.productId];
                state.items = action.payload.items;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(toggleWishlistItemAsync.rejected, (state, action) => {
                // Clear loading state for specific product
                delete state.loadingItems[action.payload.productId];
                state.error = action.payload.message;
            })
            // Clear Wishlist
            .addCase(clearWishlistAsync.pending, (state) => {
                state.status.clearWishlist = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(clearWishlistAsync.fulfilled, (state, action) => {
                state.status.clearWishlist = 'succeeded';
                state.items = action.payload.items;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(clearWishlistAsync.rejected, (state, action) => {
                state.status.clearWishlist = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
