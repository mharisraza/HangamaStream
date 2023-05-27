import axios from 'axios';

export const BASE_URL = 'http://localhost:8080'; 

export const apiCaller = axios.create({
    baseURL: BASE_URL
});

apiCaller.interceptors.request.use((config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if(jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

