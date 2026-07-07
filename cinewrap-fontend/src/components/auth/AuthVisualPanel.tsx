import { motion } from "framer-motion";

type AuthMode = "login" | "register";

interface AuthVisualPanelProps {
  mode: AuthMode;
}

/**
 * AuthVisualPanel: Panel ảnh trang trí (LeftSide for Login, RightSide for Register)
 * ------------------------------------------------------------------
 * Purely decorative half of the popup. Reuses the same poster-collage
 * + gradient-overlay language as NewReleases/Recommended cards so the
 * modal still feels like part of CineWrap rather than a generic
 * "auth page" bolted on.
 *
 * Content (tagline + CTA copy) swaps based on `mode` so the same panel
 * component can serve both flows without duplicating markup — this is
 * what lets AuthModal simply flip flex-direction to move it from left
 * to right instead of maintaining two near-identical components.
 *
 * Hidden below `md` breakpoint: on mobile the form must be the very
 * first thing the user sees (mobile-first, one-handed use per
 * DESIGN.md section 7), so the decorative panel collapses away rather
 * than pushing the form below the fold.
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
      {/* Poster collage background — a soft mosaic feel via repeating gradient blocks;
          keeps this file self-contained without depending on external poster assets. */}
      <div
        className="absolute inset-0 bg-[#1e293b]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(0,163,255,0.18) 0%, transparent 40%), linear-gradient(315deg, rgba(255,193,7,0.14) 0%, transparent 45%)",
        }}
      />

      {/* Darken + brand tint overlay so text stays readable, matching CategoriesGrid's layered-overlay pattern */}
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
        {/* Vertical accent bar, consistent with section-header convention used across the homepage */}
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

        {/* Logo watermark, echoes footer's subtle-watermark rule */}
        <div className="mt-10 text-lg font-extrabold tracking-tight text-white/20">
          CineWrap
        </div>
      </motion.div>
    </div>
  );
}
