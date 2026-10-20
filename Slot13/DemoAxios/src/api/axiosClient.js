import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: log method + url và gắn token nếu có
axiosClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: đo thời gian xử lý và việt hóa thông báo lỗi
axiosClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`[HTTP Response] ${response.config.url} xử lý trong: ${duration}ms`);
    return response.data; // Trả thẳng data
  },
  (error) => {
    let customMessage = error.message;
    if (error.response) {
      if (error.response.status === 404) customMessage = 'Không tìm thấy dữ liệu (404)';
      else if (error.response.status >= 500) customMessage = 'Máy chủ đang gặp sự cố (5xx)';
      else customMessage = `Lỗi máy chủ: ${error.response.status}`;
    } else if (error.code === 'ECONNABORTED') {
      customMessage = 'Request quá thời gian chờ (Timeout)';
    } else {
      customMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!';
    }
    return Promise.reject(new Error(customMessage));
  }
);

export default axiosClient;