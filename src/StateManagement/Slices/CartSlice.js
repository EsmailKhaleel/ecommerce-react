import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { addToCart, clearCart, getCart, removeFromCart } from '../../services/cartService';

const itemKey = item => `${item.product?.id || item.product?._id || item.productId}:${item.variant?._id || item.variantId || ''}`;
const actionKey = value => `${value.productId}:${value.variantId || ''}`;

// Async thunks
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity, variantId }, { rejectWithValue }) => {
        try {
            const response = await addToCart(productId, quantity, variantId);
            return {
                cart: response.data.cart,
                productId,
                quantity,
                variantId
            };
        } catch (error) {
            return rejectWithValue({
                message: error.message || 'Failed to add to cart',
                productId,
                variantId
            });
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
    async ({ productId, variantId }, { rejectWithValue }) => {
        try {
            const response = await removeFromCart(productId, variantId);
            return {
                cart: response.data.cart,
                productId,
                variantId
            };
        } catch (error) {
            return rejectWithValue({
                message: error.message || 'Failed to remove from cart',
                productId,
                variantId
            });
        }
    }
);

export const getCartAsync = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCart();
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch cart');
        }
    }
);

export const clearCartAsync = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await clearCart();
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to clear cart');
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
            getCart: 'idle',
            clearCart: 'idle'
        },
        loadingItems: {}, // Track loading state per product
        error: null,
        mutationVersion: 0,
    },
    reducers: {
        setCart: (state, action) => {
            state.items = (action.payload || []).filter(item => item.product && typeof item.product === "object");
        }
    },
    extraReducers: (builder) => {
        builder
            // Add to cart
            .addCase(addToCartAsync.pending, (state, action) => {
                state.status.addToCart = 'loading';
                state.mutationVersion += 1;
                // Set loading state for specific product
                state.loadingItems[actionKey(action.meta.arg)] = true;
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.status.addToCart = 'succeeded';
                state.mutationVersion += 1;
                const key = actionKey(action.payload);
                const item = action.payload.cart.find(candidate => itemKey(candidate) === key);
                state.items = state.items.filter(candidate => itemKey(candidate) !== key);
                if (item) state.items.push(item);
                // Clear loading state for specific product
                delete state.loadingItems[key];
                toast.success('Cart updated successfully');
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status.addToCart = 'failed';
                // Clear loading state for specific product
                delete state.loadingItems[actionKey(action.meta.arg)];
                state.error = action.payload.message;
                toast.error(action.payload.message || 'Failed to update cart');
            })
            // Remove from cart
            .addCase(removeFromCartAsync.pending, (state, action) => {
                state.status.removeFromCart = 'loading';
                state.mutationVersion += 1;
                // Set loading state for specific product
                state.loadingItems[`${action.meta.arg.productId}:${action.meta.arg.variantId || ''}`] = true;
                state.error = null;
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.status.removeFromCart = 'succeeded';
                state.mutationVersion += 1;
                state.items = state.items.filter(item => itemKey(item) !== actionKey(action.payload));
                // Clear loading state for specific product
                delete state.loadingItems[`${action.payload.productId}:${action.payload.variantId || ''}`];
                toast.success('Item removed from cart');
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.status.removeFromCart = 'failed';
                // Clear loading state for specific product
                delete state.loadingItems[`${action.meta.arg.productId}:${action.meta.arg.variantId || ''}`];
                state.error = action.payload.message;
                toast.error(action.payload.message || 'Failed to remove item');
            })
            // Get cart
            .addCase(getCartAsync.pending, (state, action) => {
                state.readVersion = state.mutationVersion;
                state.readRequest = action.meta.requestId;
                state.status.getCart = 'loading';
            })
            .addCase(getCartAsync.fulfilled, (state, action) => {
                if (state.readRequest !== action.meta.requestId || state.readVersion !== state.mutationVersion) return;
                state.status.getCart = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getCartAsync.rejected, (state, action) => {
                if (state.readRequest !== action.meta.requestId) return;
                state.status.getCart = 'failed';
                state.error = action.payload;
                toast.error(action.payload || 'Failed to fetch cart');
            })
            // Clear cart
            .addCase(clearCartAsync.pending, (state) => {
                state.status.clearCart = 'loading';
                state.mutationVersion += 1;
                state.error = null;
            })
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.status.clearCart = 'succeeded';
                state.items = [];
            })
            .addCase(clearCartAsync.rejected, (state, action) => {
                state.status.clearCart = 'failed';
                state.error = action.payload;
                toast.error(action.payload || 'Failed to clear cart');
            });
    }
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
