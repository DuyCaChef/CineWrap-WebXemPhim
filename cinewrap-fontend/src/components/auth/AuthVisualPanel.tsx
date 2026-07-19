import { motion } from "framer-motion";
import Logo_CineWrap from "@/assets/images/logo_CineWrap.png";

type AuthMode = "login" | "register";

interface AuthVisualPanelProps {
  mode: AuthMode;
  imageUrl?: string; // URL của hình ảnh nền
}

export default function AuthVisualPanel({
  mode,
  imageUrl,
}: AuthVisualPanelProps) {
  const copy =
    mode === "login"
      ? {
          eyebrow: "Chào mừng trở lại",
          title: "Câu chuyện của bạn\nvẫn đang chờ ở tập tiếp theo.",
          desc: "Đăng nhập để tiếp tục xem, lưu phim yêu thích và nhận đề xuất riêng cho bạn.",
        }
      : {
          eyebrow: "Bắt đầu hành trình",
          title: "Hàng ngàn bộ phim\nđang chờ được khám phá.",
          desc: "Tạo tài khoản miễn phí để lưu danh sách xem, theo dõi lịch sử và mở khóa nội dung VIP.",
        };

  return (
    <div className="relative hidden h-full w-full overflow-hidden md:block bg-transparent">
      {/* 1. Lớp nền lưới khảm nhẹ nhàng, đổi từ màu tối sang độ trong suốt siêu mỏng */}
      <div
        className="absolute inset-0 bg-no-repeat bg-white/[0.01]"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover", // "contain" là chìa khóa: Hiển thị trọn vẹn ảnh, không bị cắt
          backgroundPosition: "left 10% center", // Dịch điểm neo về phía bên trái 10%
          backgroundColor: "#05070f",
        }}
      />

      {/* 2. ✅ ĐÃ SỬA: Lớp phủ đen từ đáy lên được làm mỏng đi rất nhiều (from 90% -> 60%, và via 50% -> 20%) 
          giúp ánh sáng vàng/xanh từ backdrop rò rỉ lên cực kỳ rõ ràng */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070f]/70 via-[#05070f]/20 to-transparent" />

      {/* 3. ✅ ĐÃ SỬA: Lớp phủ đen từ trái sang phải được hạ xuống mức tối thiểu (20% -> 10%) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070f]/10 to-transparent" />

      {/* 4. Lớp phủ màu điện ảnh mỏng (Ambient Tint) giúp panel bên trái cộng hưởng nhẹ với dải sáng Teal phía sau */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,245,255,0.05)_0%,transparent_60%)] mix-blend-screen" />

      {/* Content */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 flex h-full flex-col justify-start p-10"
      >
        {/* Logo */}
        <div className="mb-2">
          <img
            src={Logo_CineWrap}
            alt="CineWrap Logo"
            className="h-20 w-auto object-contain opacity-95 transition-opacity hover:opacity-100"
          />
        </div>

        {/* Thanh nhấn dọc */}
        {/* Phần Header: Giữ nguyên bố cục nhưng thêm glow nhẹ */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-5 w-1 rounded-full bg-[#ffc107] shadow-[0_0_15px_rgba(255,193,7,0.6)]" />
          <span
            className="text-lg font-extrabold uppercase tracking-wide text-[#00a3ff] drop-shadow-md"
            style={{
              textShadow:
                "0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(0, 163, 255, 0.6)",
            }}
          >
            {copy.eyebrow}
          </span>
        </div>

        {/* Tiêu đề: Sử dụng text-shadow để tạo hiệu ứng glow điện ảnh */}
        <h2
          className="whitespace-pre-line text-[26px] font-bold leading-[1.2] text-white"
          style={{
            textShadow: "0 4px 20px rgba(0,0,1,0.8), 0 0 10px rgba(0,0,1,1.4)",
          }}
        >
          {copy.title}
        </h2>

        {/* Mô tả: Thêm drop shadow nhẹ để tách lớp khỏi ảnh nền */}
        <p
          className="mt-3 max-w-[280px] text-sm leading-relaxed text-white/90"
          style={{
            textShadow: "0 2px 4px rgba(0,1,1,0.8), 0 0 10px rgba(20,1,1,1.4)",
          }}
        >
          {copy.desc}
        </p>
      </motion.div>
    </div>
  );
}
