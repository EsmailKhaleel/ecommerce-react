import { useEffect, useState, useCallback } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import { useDispatch } from 'react-redux';
import { setCart } from '../StateManagement/Slices/CartSlice';
import axiosInstance from "../services/axiosInstance";
import { toggleWishlist } from "../services/wishlistService";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const loadUser = useCallback(async () => {
        try {
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await getCurrentUser();
            if (token !== localStorage.getItem('token')) return;
            setUser(response.data.user);
            // Update cart in Redux store
            if (response.data.user.cart) {
                dispatch(setCart(response.data.user.cart));
            }
        } catch (error) {
            console.error('Error loading user:', error);
            // A rejected token must not linger, or the app stays stuck in a
            // half-authenticated state on every reload
            if (error.status === 401 && token === localStorage.getItem('token')) {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, [token, dispatch]);

    // Initialize axios token and load user
    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token, loadUser]);

    const signIn = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            const { token: newToken, user: userData } = response.data;
            queryClient.clear();
            dispatch({ type: 'auth/sessionReset' });
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            // Update cart in Redux store
            if (userData.cart) {
                dispatch(setCart(userData.cart));
            }
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            toast.success('Successfully signed in!');
            return userData;
        } catch (error) {
            // Services throw ApiError, which carries the server message on
            // .message rather than on .response
            toast.error(error.message || 'Failed to sign in');
            return null;
        }
    };

    const signUp = async (name, email, password) => {
        try {
            const response = await registerUser(name, email, password);
            const { token, user } = response.data;
            queryClient.clear();
            dispatch({ type: 'auth/sessionReset' });
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
            toast.error(error.message || 'Failed to register');
            return null;
        }
    };

    const signInWithGoogle = async () => {
        window.location.assign(axiosInstance.getUri({ url: '/auth/google/url' }));
    };

    const signOut = useCallback(async () => {
        try { await axiosInstance.post("/auth/signout"); } catch { /* Always allow local logout. */ }
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        dispatch({ type: 'auth/sessionReset' });
        queryClient.clear();
        delete axiosInstance.defaults.headers.common['Authorization'];
        toast.success('Successfully logged out!');
    }, [dispatch, queryClient]);

    useEffect(() => {
        const expire = () => {
            setUser(null);
            setToken(null);
            dispatch({ type: 'auth/sessionReset' });
            queryClient.clear();
        };
        const storage = (event) => { if (event.key === 'token') { expire(); setToken(event.newValue); } };
        window.addEventListener('auth-expired', expire);
        window.addEventListener('storage', storage);
        return () => { window.removeEventListener('auth-expired', expire); window.removeEventListener('storage', storage); };
    }, [dispatch, queryClient]);

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
            toast.error(error.message || 'Failed to update wishlist');
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
            toggleProductInWishlist,
            setUser,
            setToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};
