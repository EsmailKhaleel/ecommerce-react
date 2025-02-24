import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Slices/CartSlice';
import firebase from 'firebase/compat/app';
import  firebaseReducer  from './Slices/FirebaseSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        firebase: firebaseReducer
    }
})