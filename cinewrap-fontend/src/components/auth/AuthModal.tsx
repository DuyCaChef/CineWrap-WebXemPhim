import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AuthBackdrop from "./AuthBackdrop";
import AuthVisualPanel from "./AuthVisualPanel";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import LoginBg from "../../assets/images/Bg_panel_login.png";
import RegisterBg from "../../assets/images/Bg_panel_register.png";

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        // Khung bọc fixed ngoài cùng trùm toàn màn hình
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* 1. LỚP NỀN ĐỘNG CINEMATIC (NẰM DƯỚI CÙNG) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <AuthBackdrop />
          </motion.div>

          {/* 2. LỚP PHỦ ĐEN MỜ NHẸ (TẠO ĐỘ TƯƠNG PHẢN CHO FORM) */}
          <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" />

          {/* 3. TẤM KÍNH CƯỜNG LỰC TRONG SUỐT (NẰM TRÊN CÙNG) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            // Thay thế hoàn toàn bằng chuỗi class kính thấu này:
            className={`relative z-20 flex h-[600px] w-full max-w-[860px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] ${
              mode === "register" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-md transition-colors hover:bg-black/50 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Khung bên trái (Đảm bảo trong suốt) */}
            <div className="hidden w-[42%] md:block bg-transparent">
              <AuthVisualPanel
                mode={mode}
                imageUrl={mode === "login" ? LoginBg : RegisterBg}
              />
            </div>

            {/* Khung chứa Form con bên phải (Đảm bảo trong suốt) */}
            <div className="w-full overflow-y-auto md:w-[58%] bg-transparent">
              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <LoginForm
                    key="login"
                    onSwitchToRegister={() => setMode("register")}
                    onSuccess={onClose} //  Truyền hàm đóng modal vào đây khi đăng nhập thành công
                  />
                ) : (
                  <RegisterForm
                    key="register"
                    onSwitchToLogin={() => setMode("login")}
                    onClose={() => onClose()} //  Truyền hàm đóng modal vào đây
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
