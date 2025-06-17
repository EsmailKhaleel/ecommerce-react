import { useEffect, useState, useCallback } from "react";
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser, registerUser, getCurrentUser, toggleWishlist } from '../utils/api';
import axios from '../utils/axiosInstance';
import { AuthContext } from './AuthContext';
import { useDispatch } from 'react-redux';
import { setCart } from '../StateManagement/Slices/CartSlice';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const loadUser = useCallback(async () => {
        try {
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await getCurrentUser();
            setUser(response.data.user);
            // Update cart in Redux store
            if (response.data.user.cart) {
                dispatch(setCart(response.data.user.cart));
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    }, [token, dispatch]);

    // Initialize axios token and load user
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token, loadUser]);

    const signIn = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            const { token: newToken, user: userData } = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            // Update cart in Redux store
            if (userData.cart) {
                dispatch(setCart(userData.cart));
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            toast.success('Successfully signed in!');
            return userData;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to sign in');
            return null;
        }
    };

    const signUp = async (name, email, password) => {
        try {
            const response = await registerUser(name, email, password);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            // Update cart in Redux store
            if (user.cart) {
                dispatch(setCart(user.cart));
            }
            toast.success('Successfully registered!');
            return user;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register');
            return null;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // After successful Google sign in, send the user info to your backend
            const response = await loginUser(result.user.email, null, {
                name: result.user.displayName,
                googleId: result.user.uid
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            // Update cart in Redux store
            if (user.cart) {
                dispatch(setCart(user.cart));
            }
            toast.success('Successfully signed in with Google!');
            return user;
        } catch (error) {
            console.error('Google Sign In Error:', error);
            toast.error('Failed to sign in with Google');
            return null;
        }
    };

    const signOut = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        dispatch(setCart([])); // Clear cart in Redux store
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Successfully logged out!');
    }, [dispatch]);

    // Wishlist functions
    const toggleProductInWishlist = async (productId) => {
        try {
            const response = await toggleWishlist(productId);
            setUser(prev => ({
                ...prev,
                wishlist: response.data.wishlist
            }));
            toast.success('Wishlist updated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signIn,
            signUp,
            signInWithGoogle,
            signOut,
            toggleProductInWishlist
        }}>
            {children}
        </AuthContext.Provider>
    );
};
