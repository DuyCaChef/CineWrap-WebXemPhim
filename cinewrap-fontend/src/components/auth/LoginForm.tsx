import { useState } from "react";
import { motion } from "framer-motion";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSubmit?: (data: { email: string; password: string }) => void;
}

/**
 * LoginForm
 * ------------------------------------------------------------------
 * Phiên bản nâng cấp giao diện "Kính Trắng Sữa" (Frosted Glass)
 * Giúp tăng độ sáng, độ rõ nét của chữ và các ô nhập liệu trên nền tối.
 */
export default function LoginForm({
  onSwitchToRegister,
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({ email, password });
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
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            // ✅ ĐÃ SỬA: Đồng bộ hóa ô input password thành dạng kính mờ sáng sủa bg-white/[0.05]
            className="h-11 rounded-lg border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] px-4 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[#00a3ff] focus:shadow-[0_0_0_3px_rgba(0,163,255,0.15)]"
          />
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
        // ✅ ĐÃ SỬA: Chuyển sang nút kính mờ đồng điệu bg-white/[0.04]
        className="mt-6 flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm text-sm font-semibold text-white transition-colors hover:bg-white/[0.08] hover:border-[#00a3ff]"
      >
        Tiếp tục với Google
      </button>
    </motion.div>
  );
}
