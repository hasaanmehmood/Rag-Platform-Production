import axios, { AxiosInstance } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: any) {
    return this.api.get<T>(url, { params });
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.api.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any) {
    return this.api.put<T>(url, data);
  }

  delete<T>(url: string) {
    return this.api.delete<T>(url);
  }

  getAxiosInstance() {
    return this.api;
  }
}

export default new ApiService();