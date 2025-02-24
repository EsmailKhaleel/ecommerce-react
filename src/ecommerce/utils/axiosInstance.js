import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'json-server-project-production.up.railway.app',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosInstance;