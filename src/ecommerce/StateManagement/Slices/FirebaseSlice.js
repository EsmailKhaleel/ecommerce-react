import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { database } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const initialState = {
    products: [],
    status: "idle",
    error: null,
}
// Firebase Products Collection Reference
const productsCollectionRef = collection(database, "ecoomerce-products");

export const fetchFirebaseProducts = createAsyncThunk(
    'fetchFirebaseProducts',
    async () => {
        const data = await getDocs(productsCollectionRef);
        const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return filteredData;
    }
);
export const firebaseSlice = createSlice({
    name: 'firebaseProducts',
    initialState: initialState,
    extraReducers: builder => {
        builder.addCase(fetchFirebaseProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products = action.payload;
            console.log("Firebase Products:", state.products);
        });
        builder.addCase(fetchFirebaseProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
        builder.addCase(fetchFirebaseProducts.pending, (state) => {
            state.status = 'loading';
        });
    }
});
export default firebaseSlice.reducer