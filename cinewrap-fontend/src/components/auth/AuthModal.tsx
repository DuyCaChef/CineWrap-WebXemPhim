import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AuthBackdrop from "./AuthBackdrop";
import AuthVisualPanel from "./AuthVisualPanel";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
}

/**
 * AuthModal: component chính (export default) cho popup đăng nhập/đăng ký.
 * ------------------------------------------------------------------
 *Cửa sổ bật lên được kích hoạt từ nút "Đăng nhập" trong phần Header. Hiển thị dưới dạng
 * lớp phủ cố định với:
 *
 *   - AuthBackdrop: làm tối trang + hiệu ứng chuyển màu chậm từ xanh navy sang xanh lơ + hiệu ứng khói
 *     các mảng màu mềm mại phía sau thẻ, tạo bầu không khí "điện ảnh sống động".
 *   - Một tấm thẻ hai cột: AuthVisualPanel (decorative) + the active
 *     form (LoginForm / RegisterForm).
 *
 * Left/Right flip logic
 * ----------------------
 * Rather than maintaining two separate layout components for Login vs
 * Register, the card is a single flex row whose `flex-row-reverse` is
 * toggled by `mode`. That satisfies the brief directly:
 *   - Login  -> visual panel LEFT,  form RIGHT
 *   - Register -> visual panel RIGHT, form LEFT
 * AnimatePresence + a keyed motion.div Thực hiện chuyển đổi mượt mà (cross-fade) khi thay đổi nội dung,
 * để tạo cảm giác đây là một sự chuyển tiếp có chủ đích thay vì một cú nhảy bố cục đột ngột.
 *
 * Thao tác đóng (Close behavior): nhấp vào vùng nền, nút X hoặc phím Escape
 * tất cả đều đóng cửa sổ modal. Việc cuộn trang bị khóa khi cửa sổ đang mở.
 */
export default function AuthModal({
  isOpen,
  initialMode = "login",
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (!isOpen) return;

    // Lock background scroll while the popup is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop: click-to-close + darken + ambient motion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
            onClick={onClose}
          >
            <AuthBackdrop />
            {/* Một lớp phủ tối tĩnh được đặt phía trên nền động, 
            giúp nội dung thẻ luôn dễ đọc bất kể vị trí hiện tại của dải màu chuyển sắc. */}
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 flex h-[600px] w-full max-w-[860px] overflow-hidden rounded-2xl border border-white/10 bg-[#1e293b] shadow-2xl ${
              mode === "register" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-md transition-colors hover:bg-black/50 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Decorative side — LeftSide for login, RightSide for register via row-reverse above */}
            <div className="hidden w-[42%] md:block">
              <AuthVisualPanel mode={mode} />
            </div>

            {/* Form side */}
            <div className="w-full overflow-y-auto md:w-[58%]">
              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <LoginForm
                    key="login"
                    onSwitchToRegister={() => setMode("register")}
                  />
                ) : (
                  <RegisterForm
                    key="register"
                    onSwitchToLogin={() => setMode("login")}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
