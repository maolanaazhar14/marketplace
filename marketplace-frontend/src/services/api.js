import axios from 'axios';

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Alamat backend Go Anda
});

// Interceptor untuk menambahkan token JWT ke setiap request yang memerlukan otentikasi
api.interceptors.request.use(
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

export default api;