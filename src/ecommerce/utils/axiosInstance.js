import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://json-server-project-production.up.railway.app',
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosInstance;