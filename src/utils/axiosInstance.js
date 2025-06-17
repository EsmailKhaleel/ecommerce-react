import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://json-server-project-khaki.vercel.app/api',
    // baseURL: 'http://localhost:3000/api',
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
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;