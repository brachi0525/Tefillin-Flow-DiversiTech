import axios from 'axios';
const baseURL = 'http://localhost:3001';
const axiosInstance = axios.create({
  baseURL,
});
// Refresh token logic
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}
// Request: Add Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
// Response: Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken: localStorage.getItem('refreshToken'),
        });
        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        onTokenRefreshed(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;






