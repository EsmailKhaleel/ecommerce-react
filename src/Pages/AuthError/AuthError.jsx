import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const AuthError = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const errorMessage = searchParams.get('message') || 'Authentication failed';
        console.error('Auth error:', errorMessage);
        const timeout = setTimeout(() => {
            navigate('/auth?error=' + encodeURIComponent(errorMessage));
        }, 3000);
        return () => clearTimeout(timeout);
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-4">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Authentication Error
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Redirecting to login page...
                </p>
            </div>
        </div>
    );
};

export default AuthError; 