import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://json-server-project-khaki.vercel.app',
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosInstance;