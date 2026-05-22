import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR (ADD TOKEN AUTOMATICALLY)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or redux if you prefer

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - token expired or invalid');
      // later you can auto logout here
    }

    return Promise.reject(error);
  }
);

export default API;