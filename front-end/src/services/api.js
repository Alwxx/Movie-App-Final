import axios from 'axios';

const api = axios.create({
    baseURL: 'https://movie-app-final-serverside.vercel.app/',
    headers: {
        'Authorization': 'Bearer YOUR_GITHUB_TOKEN',
        'Content-Type': 'application/json',
        }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
        },
        (error) => {
            return Promise.reject(error);
            }
);

export default api;