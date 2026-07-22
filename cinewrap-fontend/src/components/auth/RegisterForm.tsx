import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSubmit?: (data: { name: string; email: string; password: string }) => void;
  onClose?: () => void; // Thêm prop này để nhận hàm đóng modal từ cha xuống
}

/**
 * RegisterForm
 * ------------------------------------------------------------------
 * Giao diện đăng ký kính mờ đồng bộ hóa hoàn toàn với phong cách thiết kế rạp phim.
 */
export default function RegisterForm({
  onSwitchToLogin,
  onSubmit,
  onClose,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    if (!agreed) {
      setError("Bạn cần đồng ý với Điều khoản sử dụng để tiếp tục.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({ name, email, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm điều hướng đến trang Điều khoản sử dụng
  const handleNavigateToTerms = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    onClose?.(); // Đóng Modal lại trước
    navigate("/#terms-section"); // Điều hướng đến trang Điều khoản sử dụng
  };
  // Hàm điều hướng đến trang Chính sách bảo mật
  const handleNavigateToPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose?.(); // Đóng Modal lại trước
    navigate("/#privacy-section");
  };

  return (
    <motion.div
      key="register-form"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex h-full w-full flex-col justify-center bg-white/[0.03] backdrop-blur-xl p-8 md:p-12"
    >
      <h1 className="text-[28px] font-bold leading-tight text-white">
        Tạo tài khoản
      </h1>
      <p className="mt-2 text-sm text-[#9ca3af]">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-[#00a3ff] transition-colors hover:text-[#ffc107]"
        >
          Đăng nhập
        </button>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
        {/* Họ và tên */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-name"
            className="text-xs font-medium text-[#9ca3af]"
          >
            Họ và tên
          </label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="h-11 rounded-lg border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] backdrop-blur-md px-4 text-sm text-white placeholder:text-[#9ca3af]/40 outline-none transition-all focus:border-[#00a3ff] focus:shadow-[0_0_0_3px_rgba(0,163,255,0.15)]"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-email"
            className="text-xs font-medium text-[#9ca3af]"
          >
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="username@gmail.com"
            className="h-11 rounded-lg border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] backdrop-blur-md px-4 text-sm text-white placeholder:text-[#9ca3af]/40 outline-none transition-all focus:border-[#00a3ff] focus:shadow-[0_0_0_3px_rgba(0,163,255,0.15)]"
          />
        </div>

        {/* Mật khẩu & Nhập lại */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-password"
              className="text-xs font-medium text-[#9ca3af]"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-lg border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] backdrop-blur-md px-4 text-sm text-white placeholder:text-[#9ca3af]/40 outline-none transition-all focus:border-[#00a3ff] focus:shadow-[0_0_0_3px_rgba(0,163,255,0.15)]"
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

          {/* Nhập lại mật khẩu */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-confirm"
              className="text-xs font-medium text-[#9ca3af]"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                id="reg-confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-lg border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] backdrop-blur-md px-4 text-sm text-white placeholder:text-[#9ca3af]/40 outline-none transition-all focus:border-[#00a3ff] focus:shadow-[0_0_0_3px_rgba(0,163,255,0.15)]"
              />

              {/* Nút ẩn hiện mật khẩu */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#9ca3af] hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
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
        </div>

        {/* Checkbox Điều khoản */}
        <label className="mt-1 flex cursor-pointer items-start gap-2 text-xs text-[#9ca3af]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-black/40 accent-[#ffc107]"
          />
          <span>
            Tôi đồng ý với{" "}
            <a
              href="#terms-section"
              onClick={handleNavigateToTerms} // Gắn sự kiện điều hướng
              className="text-[#00a3ff] underline-offset-2 hover:underline"
            >
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a
              href="#privacy-section"
              onClick={handleNavigateToPrivacy} // Gắn sự kiện điều hướng
              className="text-[#00a3ff] underline-offset-2 hover:underline"
            >
              Chính sách bảo mật
            </a>{" "}
            của CineWrap.
          </span>
        </label>

        {error && (
          <p className="rounded-md bg-[#e50914]/10 px-3 py-2 text-xs text-[#e50914]">
            {error}
          </p>
        )}

        {/* Nút Tạo tài khoản */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.015 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="mt-1 flex h-12 items-center justify-center rounded-lg bg-[#ffc107] text-sm font-bold text-[#0f172a] transition-colors hover:bg-[#ffce33] disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_20px_rgba(255,193,7,0.2)]"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f172a]/30 border-t-[#0f172a]" />
          ) : (
            "Tạo tài khoản"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
