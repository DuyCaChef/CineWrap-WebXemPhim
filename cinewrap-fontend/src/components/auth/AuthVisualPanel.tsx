import { motion } from "framer-motion";

type AuthMode = "login" | "register";

interface AuthVisualPanelProps {
  mode: AuthMode;
}

/**
 * AuthVisualPanel: Panel ảnh trang trí (LeftSide for Login, RightSide for Register)
 * ------------------------------------------------------------------
 * Phần này của cửa sổ bật lên (popup) chỉ mang tính chất trang trí. Nó sử dụng lại cùng kiểu thiết kế ghép ảnh (poster-collage)
 * và lớp phủ chuyển màu (gradient-overlay) như các thẻ "NewReleases" (Mới phát hành) hay "Recommended" (Đề xuất), giúp
 * cửa sổ này vẫn mang đậm phong cách CineWrap thay vì trông như một
 * "trang đăng nhập" chung chung được chắp vá vào.
 *
 * Nội dung (khẩu hiệu và lời kêu gọi hành động - CTA) sẽ thay đổi tùy theo `mode` (chế độ), cho phép cùng một
 * thành phần giao diện (component) phục vụ cả hai luồng chức năng mà không cần lặp lại mã nguồn — đây là
 * cơ chế giúp AuthModal chỉ cần thay đổi thuộc tính `flex-direction` để chuyển vị trí từ trái
 * sang phải, thay vì phải duy trì hai thành phần gần như giống hệt nhau.
 *
 * Ẩn đi khi màn hình nhỏ hơn điểm ngắt `md`: trên thiết bị di động, biểu mẫu phải là thứ
 * đầu tiên người dùng nhìn thấy (ưu tiên thiết bị di động - mobile-first, thao tác bằng một tay theo
 * tài liệu DESIGN.md, mục 7), do đó bảng trang trí sẽ được ẩn đi thay vì
 * đẩy biểu mẫu xuống dưới phần hiển thị ban đầu của màn hình (below the fold).
 */
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
    <div className="relative hidden h-full w-full overflow-hidden md:block">
      {/* Nền poster dạng ghép hình — tạo cảm giác khảm nhẹ nhàng nhờ các khối chuyển màu lặp lại;
          giúp tệp tin này hoạt động độc lập mà không cần phụ thuộc vào các tài nguyên poster bên ngoài.*/}
      <div
        className="absolute inset-0 bg-[#1e293b]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(0,163,255,0.18) 0%, transparent 40%), linear-gradient(315deg, rgba(255,193,7,0.14) 0%, transparent 45%)",
        }}
      />

      {/* Làm tối và phủ lớp màu thương hiệu để đảm bảo văn bản vẫn dễ đọc, đồng bộ với kiểu phủ lớp (layered-overlay) của CategoriesGrid.*/}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-[#0f172a]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/40 to-transparent" />

      {/* Content */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 flex h-full flex-col justify-end p-10"
      >
        {/* Thanh nhấn dọc, đồng bộ với quy tắc thiết kế tiêu đề phần được áp dụng trên toàn bộ trang chủ. */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-5 w-1 rounded-full bg-[#ffc107]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#00a3ff]">
            {copy.eyebrow}
          </span>
        </div>

        <h2 className="whitespace-pre-line text-[26px] font-bold leading-[1.2] text-white">
          {copy.title}
        </h2>

        <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-[#9ca3af]">
          {copy.desc}
        </p>

        {/* Logo dạng hình mờ, tuân theo quy tắc về hình mờ tinh tế ở phần chân trang. */}
        <div className="mt-10 text-lg font-extrabold tracking-tight text-white/20">
          CineWrap
        </div>
      </motion.div>
    </div>
  );
}
