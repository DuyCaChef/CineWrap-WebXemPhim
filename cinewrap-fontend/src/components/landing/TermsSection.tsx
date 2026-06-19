import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import dữ liệu tĩnh
import {
  TERMS_CHIPS,
  TERMS_TABS,
  TERMS_USER_DATA,
  TERMS_PLATFORM_DATA,
} from "../../constants/landingData";

export const TermsSection: React.FC = () => {
  const [openTerms, setOpenTerms] = useState<string | null>(null);
  const [activeTermsTab, setActiveTermsTab] = useState<"user" | "platform">(
    "user",
  );

  // Hàm chọn luồng dữ liệu dựa vào tab đang active
  const currentData =
    activeTermsTab === "user" ? TERMS_USER_DATA : TERMS_PLATFORM_DATA;

  return (
    <section
      id="terms"
      // TỐI ƯU 1: Giảm padding dọc trên Mobile (py-16), giữ nguyên py-24 cho Tablet/PC
      className="relative z-20 w-full bg-cine-bg-primary py-16 md:py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-0 left-1/3 w-[500px] h-[500px] bg-cine-secondary/4 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-cine-primary/4 rounded-full blur-[110px]" />

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
              Minh bạch từ ngày đầu tiên
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Điều Khoản <span className="text-cine-primary">Sử Dụng</span>
            </h2>
          </div>
        </motion.div>

        {/* ── BANNER CAM KẾT ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.05 }}
          className="relative rounded-2xl overflow-hidden border border-cine-primary/20 bg-gradient-to-r from-cine-primary/10 via-cine-primary/5 to-transparent p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cine-primary rounded-l-2xl" />
          <div className="pl-3 md:pl-4 flex-1">
            <p className="text-cine-primary font-bold text-sm md:text-base mb-1">
              Tuân thủ điều khoản sử dụng khi truy cập và sử dụng dịch vụ của
              CineWrap
            </p>
            <p className="text-cine-text-muted text-xs md:text-sm leading-relaxed">
              Bạn được quyền xem phim hợp pháp, tôn trọng bản quyền và không sử
              dụng nền tảng cho mục đích vi phạm pháp luật — đổi lại, chúng tôi
              cung cấp dịch vụ ổn định, không quảng cáo và bảo vệ dữ liệu của
              bạn.
            </p>
          </div>
          <div className="pl-3 md:pl-0 flex flex-wrap md:flex-col gap-2 flex-shrink-0">
            {TERMS_CHIPS.map((chip) => (
              <span
                key={chip.text}
                className="inline-flex items-center gap-2 text-xs text-cine-text-muted bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
              >
                <span>{chip.icon}</span>
                {chip.text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── TAB CHUYỂN NHÓM & ACCORDION NỘI DUNG ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Menu Tab */}
          {/* TỐI ƯU 3: Đổi flex dàn ngang thành flex-col trên Mobile, sm:flex-row cho màn hình rộng hơn */}
          <div className="flex flex-col sm:flex-row gap-1 p-1 bg-cine-bg-secondary rounded-xl border border-white/8 w-full sm:w-auto sm:self-start">
            {TERMS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTermsTab(tab.id as "user" | "platform");
                  setOpenTerms(null); // Tự động đóng các accordion khi chuyển tab mới cho mượt
                }}
                // Bổ sung w-full justify-center cho Mobile để dễ bấm, sm:w-auto để trả lại bình thường
                className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-3 md:py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTermsTab === tab.id
                    ? "bg-cine-primary text-cine-bg-primary shadow-lg shadow-cine-primary/20"
                    : "text-cine-text-muted hover:text-cine-text"
                }`}
              >
                <span
                  className={
                    activeTermsTab === tab.id ? "text-cine-bg-primary" : ""
                  }
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Nội dung Accordion tự động render theo Tab */}
          <motion.div
            key={activeTermsTab} // Gắn key để Framer Motion hiểu đây là khối mới khi chuyển tab
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {currentData.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="bg-cine-bg-secondary/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenTerms(openTerms === item.id ? null : item.id)
                  }
                  // TỐI ƯU 4: Bóp padding nhỏ lại trên Mobile (px-4 py-4)
                  className="w-full flex items-center gap-3 md:gap-4 px-4 py-4 md:px-6 md:py-5 text-left group"
                  aria-expanded={openTerms === item.id}
                >
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-200 ${
                      openTerms === item.id
                        ? "bg-cine-primary/20 text-cine-primary"
                        : "bg-white/5 text-cine-text-muted group-hover:bg-cine-primary/10 group-hover:text-cine-primary"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-bold text-sm md:text-base transition-colors duration-200 ${
                        openTerms === item.id
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
                      openTerms === item.id
                        ? "rotate-180 text-cine-primary"
                        : "text-cine-text-muted"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline
                      points="6 9 12 15 18 9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {openTerms === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {/* Bóp padding nội dung tương ứng (px-4) */}
                      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 border-t border-white/5">
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── CTA CUỐI SECTION ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 md:p-8 rounded-2xl border border-white/8 bg-cine-bg-secondary/40 backdrop-blur-md"
        >
          <div className="text-center md:text-left">
            <p className="text-cine-text font-bold text-base mb-1">
              Có thắc mắc về điều khoản?
            </p>
            <p className="text-cine-text-muted text-sm">
              Đội ngũ hỗ trợ sẵn sàng giải đáp mọi câu hỏi pháp lý của bạn.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 flex-shrink-0">
            <a
              href="mailto:legal@cinewrap.vn"
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-3 rounded-full bg-cine-secondary/10 border border-cine-secondary/30 text-cine-secondary text-sm font-semibold hover:bg-cine-secondary/20 transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              legal@cinewrap.vn
            </a>
            <a
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("support")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-3 rounded-full bg-cine-primary/10 border border-cine-primary/30 text-cine-primary text-sm font-semibold hover:bg-cine-primary/20 transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Liên hệ hỗ trợ
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
