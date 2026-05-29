import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

// URL API backend
const API_URL = apiUrl; // Đổi thành URL của bạn

// Lấy access token từ localStorage
const getAccessToken = () => localStorage.getItem('token');

// Lấy refresh token từ localStorage
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'  
  },
});

// Thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý lỗi và refresh token nếu gặp 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      try {
        const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { token } = res.data;

        // Lưu access token mới vào localStorage
        localStorage.setItem('token', token);

        // Gửi lại request với access token mới
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/dang-nhap';
        //return Promise.reject(refreshError);
      }
    }
    return error;
  }
);

export default axiosInstance;
