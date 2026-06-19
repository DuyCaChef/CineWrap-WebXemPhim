import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRIVACY_STATS,
  PRIVACY_ACCORDION_DATA,
} from "../../constants/landingData";

export const PrivacySection: React.FC = () => {
  // Quản lý trạng thái mở/đóng của các mục chính sách
  const [openPrivacy, setOpenPrivacy] = useState<string | null>(null);

  return (
    <section
      id="privacy"
      // TỐI ƯU 1: Giảm padding dọc trên Mobile (py-16), giữ nguyên py-24 cho Tablet/PC
      className="relative z-20 w-full bg-cine-bg-secondary py-16 md:py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden"
    >
      {/* TỐI ƯU 2: Giảm gap trên Mobile (gap-12), mở rộng trên Desktop (lg:gap-20) */}
      <div className="max-w-8xl mx-auto flex flex-col gap-12 lg:gap-20 relative">
        {/* ── HERO TAGLINE ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="text-cine-secondary text-xs uppercase tracking-[0.3em] font-semibold mb-3 md:mb-4">
              Dữ liệu của bạn, quyền của bạn
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Chính Sách <span className="text-cine-primary">Bảo Mật</span>
            </h2>
          </div>
          <p className="text-cine-text-muted text-sm leading-relaxed max-w-md md:text-right">
            Chúng tôi cam kết minh bạch về cách dữ liệu của bạn được thu thập,
            sử dụng và bảo vệ. Cập nhật lần cuối:{" "}
            <span className="text-cine-text font-semibold">11/06/2026</span>
          </p>
        </motion.div>

        {/* ── XỬ LÝ 1: Render 4 Huy hiệu thống kê từ Data ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.1 }}
          // TỐI ƯU 3: Mobile 1 cột -> Tablet nhỏ 2 cột -> Desktop 4 cột an toàn tuyệt đối
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {PRIVACY_STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-5 rounded-2xl border ${stat.bg} backdrop-blur-md`}
            >
              <div className={`flex-shrink-0 ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className={`text-base font-extrabold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-cine-text-muted text-xs leading-snug mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── XỬ LÝ 2: Render Accordion List ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="flex flex-col gap-3"
        >
          {PRIVACY_ACCORDION_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-cine-bg-primary/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md"
            >
              <button
                onClick={() =>
                  setOpenPrivacy(openPrivacy === item.id ? null : item.id)
                }
                className="w-full flex items-center gap-4 px-5 md:px-6 py-4 md:py-5 text-left group"
              >
                <div
                  className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                    openPrivacy === item.id
                      ? "bg-cine-primary/20 text-cine-primary"
                      : "bg-white/5 text-cine-text-muted group-hover:bg-cine-primary/10 group-hover:text-cine-primary"
                  }`}
                >
                  {item.icon}
                </div>
                {/* Lớp min-w-0 ở đây cực kỳ quan trọng để chữ tự động dùng dấu "..." (truncate) khi quá dài trên điện thoại hẹp, không đẩy bể layout */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm md:text-base transition-colors ${
                      openPrivacy === item.id
                        ? "text-cine-primary"
                        : "text-cine-text group-hover:text-cine-primary/80"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-cine-text-muted text-xs mt-0.5 truncate">
                    {item.summary}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openPrivacy === item.id
                      ? "rotate-180 text-cine-primary"
                      : "text-cine-text-muted"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <AnimatePresence>
                {openPrivacy === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 border-t border-white/5">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
