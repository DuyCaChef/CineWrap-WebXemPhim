import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 🚀 CẤU HÌNH PROXY CHỐNG LỖI CORS & ERR_FAILED LOCAL
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001", // Đường dẫn tới NestJS Back-end
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Bỏ tiền tố /api khi gửi sang NestJS
      },
    },
  },
});
