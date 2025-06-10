import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://lackadaisical-quintessential-racer.glitch.me',
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosInstance;