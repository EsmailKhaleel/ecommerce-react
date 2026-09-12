import axios from "axios";

// VITE_API_URL may be configured with or without the trailing /api segment,
// so normalise it rather than depending on how it happens to be written.
const resolveBaseUrl = () => {
    const configured = import.meta.env.VITE_API_URL?.trim();
    if (!configured) return 'http://localhost:3000/api';

    const withoutTrailingSlash = configured.replace(/\/+$/, '');
    return withoutTrailingSlash.endsWith('/api')
        ? withoutTrailingSlash
        : `${withoutTrailingSlash}/api`;
};

const axiosInstance = axios.create({
    baseURL: resolveBaseUrl(),
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !['/auth/login', '/auth/register'].includes(error.config?.url) && error.config?.headers?.Authorization === `Bearer ${localStorage.getItem('token')}`) {
            localStorage.removeItem('token');
            delete axiosInstance.defaults.headers.common.Authorization;
            window.dispatchEvent(new Event('auth-expired'));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;