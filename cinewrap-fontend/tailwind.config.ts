/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 1. Khai báo Font chữ để có thể gọi class font-sans
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
      // 2. Cấu hình Bảng màu dự án
      colors: {
        cine: {
          // Nền chính của web (thường là đen hoặc xanh đen đậm)
          bg: "#0B0F19",

          // Nền phụ cho các khối (card phim, header, menu)
          surface: "#0F172A",

          // Màu nhấn chính (ví dụ: màu vàng/cam của logo CineWrap)
          primary: "#FFC107",

          // Màu nhấn phụ (ví dụ: màu đỏ cho các nút bấm quan trọng/hover)
          secondary: "#E50914",

          // Bảng màu chuẩn cho văn bản
          text: {
            DEFAULT: "#FFFFFF", // Trắng cho text chính
            muted: "#9CA3AF", // Xám cho text phụ, thông tin thêm
          },
        },
      },
    },
  },
  plugins: [],
};
