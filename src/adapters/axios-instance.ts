import axios from "axios";
import axiosRetry from "axios-retry";

const SERVER_BASE = "http://localhost:3002";

const axiosInstance = axios.create({
    baseURL: SERVER_BASE
});

axiosRetry(axiosInstance, { retries: 10, retryDelay: axiosRetry.exponentialDelay });

export default axiosInstance;