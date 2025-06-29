import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import { useDispatch } from 'react-redux';
import { setCart } from '../../StateManagement/Slices/CartSlice';
import axios from '../../utils/axiosInstance';
import Spinner from '../../Components/Spinner';
import { toast } from 'react-toastify';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser, setToken } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleAuthSuccess = async () => {
            // Get token and user data from URL parameters using useSearchParams
            const token = searchParams.get('token');
            const userData = searchParams.get('user');
            
            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    
                    // Store authentication data
                    localStorage.setItem('token', token);
                    
                    // Update AuthProvider context
                    setToken(token);
                    setUser(user);
                    
                    // Update axios headers
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Update cart in Redux store
                    if (user.cart) {
                        dispatch(setCart(user.cart));
                    }
                    
                    // Clean up URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    
                    // Show success message
                    toast.success('Successfully signed in with Google!');
                    
                    // Redirect to products page
                    navigate('/products');
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    toast.error('Authentication failed');
                    navigate('/login?error=auth_failed');
                }
            } else {
                console.error('Missing token or user data');
                toast.error('Authentication failed');
                navigate('/login?error=auth_failed');
            }
        };

        // Handle the OAuth callback
        handleAuthSuccess();
    }, [navigate, setToken, setUser, dispatch, searchParams]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-4">
                    <Spinner />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Processing authentication...</p>
            </div>
        </div>
    );
};

export default AuthSuccess; 