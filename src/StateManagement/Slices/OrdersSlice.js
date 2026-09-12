import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

export const getUserOrdersAsync = createAsyncThunk(
    'orders/getUserOrders',
    async (options, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/orders', { params: { page: options?.page || 1, limit: 10 } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        page: 1,
        totalPages: 0
    },
    reducers: {
        clearOrders: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserOrdersAsync.pending, (state, action) => {
                state.requestId = action.meta.requestId;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUserOrdersAsync.fulfilled, (state, action) => {
                if (state.requestId !== action.meta.requestId) return;
                state.status = 'succeeded';
                state.items = action.payload.orders;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.error = null;
            })
            .addCase(getUserOrdersAsync.rejected, (state, action) => {
                if (state.requestId !== action.meta.requestId) return;
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
