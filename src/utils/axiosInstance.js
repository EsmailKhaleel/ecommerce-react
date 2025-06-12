import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://json-server-project-khaki.vercel.app/api',
    // baseURL: 'http://localhost:3000/api',
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosInstance;