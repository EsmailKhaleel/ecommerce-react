import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

export const getUserOrdersAsync = createAsyncThunk(
    'orders/getUserOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/orders?userId=${userId}`);
            return response.data.orders;
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
        error: null
    },
    reducers: {
        clearOrders: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserOrdersAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUserOrdersAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.error = null;
            })
            .addCase(getUserOrdersAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
