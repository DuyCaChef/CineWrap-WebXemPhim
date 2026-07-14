import { motion } from "framer-motion";

type AuthMode = "login" | "register";

interface AuthVisualPanelProps {
  mode: AuthMode;
}

export default function AuthVisualPanel({ mode }: AuthVisualPanelProps) {
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
        className="absolute inset-0 bg-white/[0.01]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(0,245,255,0.08) 0%, transparent 50%), linear-gradient(315deg, rgba(255,163,0,0.06) 0%, transparent 50%)",
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
        className="relative z-10 flex h-full flex-col justify-end p-10"
      >
        {/* Thanh nhấn dọc */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-5 w-1 rounded-full bg-[#ffc107] shadow-[0_0_15px_rgba(255,193,7,0.6)]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#00a3ff]">
            {copy.eyebrow}
          </span>
        </div>

        {/* Tiêu đề - Thêm drop-shadow rõ hơn để luôn nổi bật trên nền sáng */}
        <h2 className="whitespace-pre-line text-[26px] font-bold leading-[1.2] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {copy.title}
        </h2>

        {/* Mô tả */}
        <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-[#9ca3af] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          {copy.desc}
        </p>

        {/* Logo CineWrap */}
        <div className="mt-10 text-lg font-extrabold tracking-tight text-white/25">
          CineWrap
        </div>
      </motion.div>
    </div>
  );
}
