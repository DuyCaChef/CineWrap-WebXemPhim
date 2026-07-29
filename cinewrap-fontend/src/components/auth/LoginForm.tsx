import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSubmit?: (data: { email: string; password: string }) => void;
  onSuccess?: () => void; // Callback khi đăng nhập thành công, prop này để báo thành công cho AuthModal đóng lại
}

/**
 * LoginForm
 * ------------------------------------------------------------------
 * Phiên bản nâng cấp giao diện "Kính Trắng Sữa" (Frosted Glass)
 * Giúp tăng độ sáng, độ rõ nét của chữ và các ô nhập liệu trên nền tối.
 */
export default function LoginForm({
  onSwitchToRegister,

  onSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  // Sử dụng hook useAuth để lấy hàm login từ AuthContext
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1.Gọi API login tới Nest.js be
      const respone = await api.post("/auth/login", { email, password });

      // 2.Bóc tách dữ liệu trả về từ API
      const { accessToken, user } = respone.data;

      // 3.Lưu vào state toàn cục và LocalStorage thông qua hàm login từ AuthContext
      login(accessToken, user);

      // Gọi callback onSuccess để báo thành công đóng Popup
      onSuccess?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // 1. TRƯỜNG HỢP SERVER CÓ TRẢ VỀ BÁO LỖI (Mã 400, 409, 422...)
        if (err.response) {
          const serverData = err.response.data;
          const serverMessage = serverData?.message;

          if (Array.isArray(serverMessage)) {
            // Lỗi Validation từ DTO (ví dụ mảng các câu báo lỗi)
            setError(serverMessage[0]);
          } else if (typeof serverMessage === "string") {
            // Lỗi do NestJS némException (ví dụ: "Email này đã được sử dụng")
            setError(serverMessage);
          } else if (err.response.status === 500) {
            // Lỗi sập Server
            setError(
              "Hệ thống máy chủ đang gặp sự cố. Vui lòng thử lại sau ít phút!",
            );
          } else {
            setError(
              `Đã xảy ra lỗi (${err.response.status}). Vui lòng thử lại!`,
            );
          }
        }
        // 2. TRƯỜNG HỢP REQUEST GỬI ĐI NHƯNG KHÔNG NHẬN ĐƯỢC PHẢN HỒI (Lỗi Mạng/CORS/Mất kết nối)
        else if (err.request) {
          setError(
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối Internet hoặc Proxy!",
          );
        }
        // 3. TRƯỜNG HỢP LỖI CẤU HÌNH CODE FE
        else {
          setError(`Lỗi ứng dụng: ${err.message}`);
        }
      } else {
        setError("Đã xảy ra lỗi không xác định!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      key="login-form"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex h-full w-full flex-col justify-center bg-white/[0.03] backdrop-blur-xl p-8 md:p-12"
    >
      <h1 className="text-[28px] font-bold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        Đăng nhập
      </h1>
      <p className="mt-2 text-sm text-[#9ca3af]">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-[#00a3ff] transition-colors hover:text-[#ffc107]"
        >
          Đăng ký ngay
        </button>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-email"
            className="text-xs font-medium text-[#9ca3af]"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="username@gmail.com"
            // ✅ ĐÃ SỬA: Chuyển sang màu xám kính mờ nhẹ bg-white/[0.05] để ô nhập nổi bật và dễ nhìn hơn
            className="h-11 rounded-lg border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] px-4 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[#00a3ff] focus:shadow-[0_0_0_3px_rgba(0,163,255,0.15)]"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-xs font-medium text-[#9ca3af]"
            >
              Mật khẩu
            </label>
            <button
              type="button"
              className="text-xs font-medium text-[#9ca3af] transition-colors hover:text-[#00a3ff] hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              // Trạng thái input phụ thuộc vào showPassword
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] px-4 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[#00a3ff] focus:shadow-[0_0_0_3px_rgba(0,163,255,0.15)]"
            />

            {/* Nút ẩn hiện mật khẩu */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#9ca3af] hover:text-white transition-colors"
            >
              {showPassword ? (
                // Icon Mắt Mở (Sử dụng đường path đơn giản hơn)
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                // Icon Mắt Đóng
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-[#e50914]/10 px-3 py-2 text-xs text-[#e50914]">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.015 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="mt-2 flex h-12 items-center justify-center rounded-lg bg-[#ffc107] text-sm font-bold text-[#0f172a] transition-colors hover:bg-[#ffce33] disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_20px_rgba(255,193,7,0.25)]"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f172a]/30 border-t-[#0f172a]" />
          ) : (
            "Đăng nhập"
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-[#9ca3af]">hoặc</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* Google Button */}
      <button
        type="button"
        // Loại bỏ bg-clip-text và text-transparent khỏi button cha
        className="mt-6 flex h-12 gap-2 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm px-6 text-sm font-semibold text-white transition-all hover:bg-white/[0.08] hover:border-[#00a3ff]"
      >
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.3-4.74 3.3-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 6.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>

        {/* Bọc chữ trong span để áp dụng gradient riêng */}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400">
          Tiếp tục với Google
        </span>
      </button>
    </motion.div>
  );
}
