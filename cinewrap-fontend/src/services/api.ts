import axios from "axios";

// 1. Tạo instance của Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000", // URL cơ sở của API
  headers: {
    "Content-Type": "application/json", // Đặt header Content-Type là application/json
  },

  withCredentials: true, // Cho phép gửi/nhận Cookie (Refresh Token) từ BE
});

// 2. Request Interceptor: Tự động đính kèm Token vào Header trước khi gửi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Đính kèm Token vào Header Authorization
    }
    return config; // Trả về config đã được chỉnh sửa
  },
  (error) => Promise.reject(error), // Xử lý lỗi nếu có lỗi xảy ra trong quá trình gửi request
);

// 3. Response Interceptor: Xử lý lỗi tập trung từ Server trả về
api.interceptors.response.use(
  (response) => response, // Nếu response thành công, trả về response
  (error) => {
    // Nếu bị lỗi 401 (Unauthorized) do Token hết hạn hoặc không hợp lệ
    if (error.response && error.response.status === 401) {
      // Có thể xóa token cũ và reload hoặc để AuthContext xử lý
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error); // Trả về lỗi để xử lý ở nơi gọi API
  },
);
