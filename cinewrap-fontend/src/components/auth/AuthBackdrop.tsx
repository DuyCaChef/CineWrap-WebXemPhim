import { motion } from "framer-motion";

/**
 * AuthBackdrop: Lớp nền động (smoke + gradient) phía sau popup đăng nhập/đăng ký.
 * ------------------------------------------------------------------
 * Hiển thị phía sau cửa sổ bật lên (popup) Login/Signup, nằm đè lên lớp nền tối của trang.
 *
 * Gồm hai hiệu ứng xếp lớp, cả hai đều diễn ra cực chậm (trên 20 giây) để tạo cảm giác
 * về một "bầu không khí nền" thay vì một hoạt ảnh động gây xao nhãng
 * hoặc cạnh tranh sự chú ý với biểu mẫu:
 *
 * 1. Một dải chuyển màu (gradient) tỏa tròn cỡ lớn, di chuyển cực chậm giữa màu nền chính
 *    (#0f172a) và màu xanh lơ (#00a3ff) — tạo cảm giác như ánh sáng màn hình rạp chiếu phim
 *    đang biến đổi phía sau cửa sổ modal.
 * 2. Hai khối "khói" mờ ảo, mềm mại (màu vàng và xanh lơ, độ mờ rất thấp)
 *    trôi theo quỹ đạo hình tròn rộng. Sử dụng hiệu ứng làm mờ (blur) thuần CSS kết hợp với
 *    các biến đổi (transform) của Framer Motion; không cần tài nguyên bên ngoài.
 *
 * Thuộc tính `prefers-reduced-motion` được Framer Motion tự động tuân thủ
 * đối với các khối hiệu ứng sử dụng biến đổi (transform); hoạt ảnh gradient CSS
 * cũng được kiểm soát thông qua biến thể `motion-safe:` để đảm bảo dừng hoàn toàn
 * đối với người dùng đã bật chế độ giảm chuyển động (reduced motion) ở cấp hệ điều hành.
 */
export default function AuthBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0f172a]"
    >
      {/* Layer 1: slow navy <-> cyan gradient sweep */}
      <div
        className="motion-safe:animate-[authGradientShift_22s_ease-in-out_infinite] absolute inset-[-20%]"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 40%, rgba(0,163,255,0.25) 0%, rgba(15,23,42,0) 70%), radial-gradient(50% 50% at 70% 60%, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 80%)",
        }}
      />

      {/* Layer 2: drifting smoke blobs */}
      <motion.div
        className="absolute h-[38rem] w-[38rem] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,163,255,0.28) 0%, transparent 70%)",
        }}
        animate={{
          x: ["-10%", "12%", "-6%", "-10%"],
          y: ["-8%", "10%", "4%", "-8%"],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 bottom-0 h-[32rem] w-[32rem] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,193,7,0.16) 0%, transparent 70%)",
        }}
        animate={{
          x: ["8%", "-10%", "6%", "8%"],
          y: ["6%", "-6%", "-12%", "6%"],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Keyframes for the CSS gradient sweep (Tailwind v4 arbitrary animation) */}
      <style>{`
        @keyframes authGradientShift {
          0%   { transform: translate(0%, 0%) scale(1); }
          50%  { transform: translate(3%, -2%) scale(1.08); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
      `}</style>
    </div>
  );
}
