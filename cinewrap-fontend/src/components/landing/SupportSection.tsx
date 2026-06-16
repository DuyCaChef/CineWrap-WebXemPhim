import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import dữ liệu tĩnh
import {
  SUPPORT_STATS,
  FAQS,
  SUPPORT_TOPICS,
  WORKING_HOURS,
} from "../../constants/landingData";

export const SupportSection: React.FC = () => {
  // State quản lý Accordion FAQ
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // State quản lý Form nhập liệu
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Hàm xử lý gửi form
  const handleSubmitForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.category ||
      !formData.message
    )
      return;

    setFormLoading(true);
    // Giả lập gọi API gửi mail mất 1.5 giây
    setTimeout(() => {
      setFormLoading(false);
      setFormSent(true);
    }, 1500);
  };

  return (
    <section
      id="support"
      className="relative z-20 w-full bg-cine-bg-secondary py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-[-80px] right-1/4 w-[560px] h-[560px] bg-cine-secondary/6 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[420px] h-[420px] bg-cine-primary/5 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cine-secondary/3 rounded-full blur-[100px]" />

      <div className="max-w-8xl mx-auto flex flex-col gap-20 relative">
        {/* ── PHÂN VÙNG 1: HERO TAGLINE ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full rounded-3xl overflow-hidden border border-white/10 min-h-[320px] flex items-center shadow-2xl"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#071020]" />
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="support-grid"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="#00a3ff" opacity="0.4" />
                </pattern>
                <radialGradient id="support-fade" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <mask id="support-mask">
                  <rect width="100%" height="100%" fill="url(#support-fade)" />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#support-grid)"
                mask="url(#support-mask)"
              />
            </svg>
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-cine-secondary/25 rounded-full blur-[90px]" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cine-primary/15 rounded-full blur-[80px]" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cine-secondary/30 to-transparent -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 w-full h-12 bg-gradient-to-r from-transparent via-cine-secondary/5 to-transparent -translate-y-1/2" />
          </div>
          <div className="absolute inset-0 rounded-3xl border border-cine-secondary/20 z-10 pointer-events-none" />

          <div className="relative z-20 w-full px-8 md:px-16 lg:px-20 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-cine-secondary text-xs uppercase tracking-[0.35em] font-semibold mb-5 flex items-center gap-2">
                <span className="inline-block w-6 h-px bg-cine-secondary" />
                Trung tâm trợ giúp CineWrap
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5">
                Chúng Tôi Luôn{" "}
                <span className="relative inline-block">
                  <span className="text-cine-primary">Bên Bạn</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cine-primary/0 via-cine-primary to-cine-primary/0 rounded-full" />
                </span>
              </h2>
              <p className="text-cine-text-muted text-sm md:text-base leading-relaxed max-w-lg">
                Gặp sự cố kỹ thuật, thắc mắc về tài khoản hay cần tư vấn gói
                dịch vụ? Đội hỗ trợ CineWrap phản hồi nhanh — để bạn không bỏ lỡ
                một giây phim nào.
              </p>
            </div>

            {/* Render 3 chỉ số */}
            <div className="flex md:flex-col gap-4 md:gap-3 flex-shrink-0">
              {SUPPORT_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[220px]"
                >
                  <span className="text-xl flex-shrink-0">{stat.icon}</span>
                  <div>
                    <p className="text-cine-primary font-extrabold text-lg leading-none">
                      {stat.value}
                    </p>
                    <p className="text-cine-text-muted text-xs leading-snug mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── PHÂN VÙNG 2: BENTO GRID — HỖ TRỢ, LIÊN HỆ & FAQ ───────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto">
          {/* Card 1: FAQ accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1 }}
            className="md:col-span-2 bg-cine-bg-primary/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col"
          >
            <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cine-primary/15 flex items-center justify-center text-cine-primary flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12.01"
                    y2="17"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-cine-text font-bold text-sm">
                  Câu hỏi thường gặp
                </h3>
                <p className="text-cine-text-muted text-xs">
                  Giải đáp nhanh các thắc mắc phổ biến nhất
                </p>
              </div>
            </div>

            {/* Minh họa SVG */}
            <div className="px-6 pt-4 pb-2">
              <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-r from-[#060e1e] to-[#0a1628] flex items-center justify-center border border-white/5">
                <svg
                  viewBox="0 0 320 80"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="faq-screen"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00a3ff"
                        stopOpacity="0.05"
                      />
                      <stop
                        offset="50%"
                        stopColor="#00a3ff"
                        stopOpacity="0.18"
                      />
                      <stop
                        offset="100%"
                        stopColor="#00a3ff"
                        stopOpacity="0.05"
                      />
                    </linearGradient>
                    <linearGradient
                      id="faq-beam"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ffc107" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ffc107" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290].map((x) => (
                    <g key={x}>
                      <rect
                        x={x}
                        y="58"
                        width="20"
                        height="12"
                        rx="3"
                        fill="#1e293b"
                      />
                      <rect
                        x={x + 2}
                        y="52"
                        width="16"
                        height="8"
                        rx="2"
                        fill="#334155"
                      />
                    </g>
                  ))}
                  <rect
                    x="60"
                    y="8"
                    width="200"
                    height="36"
                    rx="4"
                    fill="url(#faq-screen)"
                    stroke="#00a3ff"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                  />
                  <text
                    x="155"
                    y="31"
                    textAnchor="middle"
                    fontSize="16"
                    fill="#00a3ff"
                    opacity="0.6"
                    fontWeight="bold"
                  >
                    ?
                  </text>
                  <polygon points="155,6 140,52 170,52" fill="url(#faq-beam)" />
                  <circle cx="155" cy="5" r="4" fill="#ffc107" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* Render danh sách FAQ */}
            <div className="flex flex-col gap-1.5 px-6 pb-6 pt-2">
              {FAQS.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-cine-bg-secondary/50 border border-white/8 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(openFaq === faq.id ? null : faq.id)
                    }
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left group"
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${openFaq === faq.id ? "bg-cine-primary text-cine-bg-primary" : "bg-white/8 text-cine-text-muted group-hover:bg-cine-primary/20 group-hover:text-cine-primary"}`}
                    >
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M6 2v4M6 8v.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p
                      className={`flex-1 text-sm font-semibold transition-colors duration-200 ${openFaq === faq.id ? "text-cine-primary" : "text-cine-text group-hover:text-cine-primary/80"}`}
                    >
                      {faq.q}
                    </p>
                    <svg
                      className={`w-4 h-4 flex-shrink-0 text-cine-text-muted transition-transform duration-300 ${openFaq === faq.id ? "rotate-180 text-cine-primary" : ""}`}
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
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 pt-1 text-xs text-cine-text-muted leading-relaxed border-t border-white/5">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cột phải: 3 card nhỏ xếp dọc */}
          <div className="flex flex-col gap-5">
            {/* Card: Email */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-cine-secondary/15 to-cine-secondary/5 border border-cine-secondary/25 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md overflow-hidden relative"
            >
              <div className="relative h-24 w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#071830] to-[#0a2040] flex items-center justify-center">
                <svg
                  viewBox="0 0 160 80"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="email-glow"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#00a3ff" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#00a3ff"
                        stopOpacity="0.05"
                      />
                    </linearGradient>
                  </defs>
                  <ellipse
                    cx="80"
                    cy="40"
                    rx="55"
                    ry="30"
                    fill="#00a3ff"
                    opacity="0.06"
                  />
                  <rect
                    x="35"
                    y="20"
                    width="90"
                    height="55"
                    rx="6"
                    fill="url(#email-glow)"
                    stroke="#00a3ff"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                  <polyline
                    points="35,20 80,48 125,20"
                    fill="none"
                    stroke="#00a3ff"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />
                  {[0, 8, 16].map((offset) => (
                    <line
                      key={offset}
                      x1={60 + offset}
                      y1={10 - offset}
                      x2={100 + offset}
                      y2={10 - offset}
                      stroke="#00a3ff"
                      strokeWidth="1"
                      strokeOpacity={0.15 + offset * 0.02}
                      strokeDasharray="3 3"
                    />
                  ))}
                  <circle cx="108" cy="28" r="7" fill="#00a3ff" opacity="0.8" />
                  <polyline
                    points="104,28 107,31 112,25"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-cine-secondary font-bold text-sm mb-1">
                  Email hỗ trợ
                </p>
                <p className="text-cine-text-muted text-xs leading-relaxed mb-3">
                  Gửi mô tả chi tiết vấn đề — chúng tôi phản hồi trong vòng 2
                  giờ trong giờ hành chính.
                </p>
                <a
                  href="mailto:support@cinewrap.vn"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cine-secondary hover:text-white transition-colors duration-200 group"
                >
                  support@cinewrap.vn
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="12 5 19 12 12 19"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Card: Chủ đề */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-cine-bg-primary/60 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md"
            >
              <div className="relative h-20 w-full rounded-xl overflow-hidden bg-gradient-to-r from-[#060e1e] to-[#0a1628] flex items-center justify-center">
                <svg
                  viewBox="0 0 160 70"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {[
                    { x: 10, color: "#00a3ff", label: "Video", icon: "▶" },
                    { x: 60, color: "#ffc107", label: "Account", icon: "👤" },
                    { x: 110, color: "#10b981", label: "Payment", icon: "💳" },
                  ].map((item) => (
                    <g key={item.x}>
                      <rect
                        x={item.x}
                        y="12"
                        width="40"
                        height="46"
                        rx="6"
                        fill={item.color}
                        fillOpacity="0.08"
                        stroke={item.color}
                        strokeWidth="0.8"
                        strokeOpacity="0.4"
                      />
                      <text
                        x={item.x + 20}
                        y="30"
                        textAnchor="middle"
                        fontSize="10"
                        fill={item.color}
                        opacity="0.8"
                      >
                        {item.icon}
                      </text>
                      <text
                        x={item.x + 20}
                        y="46"
                        textAnchor="middle"
                        fontSize="6"
                        fill="white"
                        opacity="0.5"
                        fontFamily="sans-serif"
                      >
                        {item.label}
                      </text>
                    </g>
                  ))}
                  <line
                    x1="50"
                    y1="35"
                    x2="60"
                    y2="35"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1="100"
                    y1="35"
                    x2="110"
                    y2="35"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-cine-text font-bold text-sm mb-2">
                  Chủ đề hỗ trợ
                </p>
                <div className="flex flex-col gap-1.5">
                  {/* Render danh sách chủ đề */}
                  {SUPPORT_TOPICS.map((topic) => (
                    <div
                      key={topic.label}
                      className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors duration-150 cursor-pointer group"
                    >
                      <span className="text-sm flex-shrink-0">
                        {topic.icon}
                      </span>
                      <span
                        className={`text-xs font-medium ${topic.color} group-hover:brightness-125 transition-all duration-150`}
                      >
                        {topic.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card: Giờ làm việc */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-cine-primary/12 to-cine-primary/4 border border-cine-primary/20 rounded-2xl p-5 flex flex-col gap-3 backdrop-blur-md"
            >
              <div className="relative h-20 w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1000] to-[#0f0a00] flex items-center justify-center">
                <svg
                  viewBox="0 0 160 70"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="clock-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffc107" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ffc107" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <ellipse
                    cx="80"
                    cy="35"
                    rx="45"
                    ry="30"
                    fill="url(#clock-glow)"
                  />
                  <circle
                    cx="80"
                    cy="35"
                    r="24"
                    fill="none"
                    stroke="#ffc107"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                  <circle
                    cx="80"
                    cy="35"
                    r="20"
                    fill="#ffc107"
                    fillOpacity="0.05"
                  />
                  {[12, 3, 6, 9].map((num, i) => {
                    const angle = ((i * 90 - 90) * Math.PI) / 180;
                    return (
                      <text
                        key={num}
                        x={80 + 16 * Math.cos(angle)}
                        y={35 + 16 * Math.sin(angle) + 2}
                        textAnchor="middle"
                        fontSize="5"
                        fill="#ffc107"
                        opacity="0.6"
                      >
                        {num}
                      </text>
                    );
                  })}
                  <line
                    x1="80"
                    y1="35"
                    x2="80"
                    y2="20"
                    stroke="#ffc107"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="80"
                    y1="35"
                    x2="92"
                    y2="38"
                    stroke="#ffc107"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeOpacity="0.7"
                  />
                  <circle cx="80" cy="35" r="2" fill="#ffc107" />
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => (
                    <g key={day}>
                      <rect
                        x={112 + (i % 4) * 10}
                        y={20 + Math.floor(i / 4) * 12}
                        width="8"
                        height="8"
                        rx="1.5"
                        fill="#ffc107"
                        fillOpacity={i < 5 ? 0.2 : 0.06}
                        stroke="#ffc107"
                        strokeWidth="0.5"
                        strokeOpacity="0.3"
                      />
                      <text
                        x={116 + (i % 4) * 10}
                        y={26 + Math.floor(i / 4) * 12}
                        textAnchor="middle"
                        fontSize="4"
                        fill="#ffc107"
                        opacity="0.5"
                      >
                        {day}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div>
                <p className="text-cine-primary font-bold text-sm mb-2">
                  Giờ phục vụ
                </p>
                <div className="space-y-1.5 text-xs text-cine-text-muted">
                  {/* Render thời gian làm việc */}
                  {WORKING_HOURS.map((hour) => (
                    <div key={hour.label} className="flex justify-between">
                      <span>{hour.label}</span>
                      <span className={`font-semibold ${hour.color}`}>
                        {hour.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── PHÂN VÙNG 3: FORM GỬI CÂU HỎI ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
        >
          {/* CỘT TRÁI: Mockup hình ngữ cảnh */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#060e1e] to-[#0a1a30] min-h-[480px] flex flex-col justify-between p-6">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-cine-secondary/10 rounded-full blur-[60px]" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cine-primary/8 rounded-full blur-[50px]" />
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center py-4">
              <svg
                viewBox="0 0 300 260"
                className="w-full max-w-[280px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="chat-bg"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#0f1f3d" />
                    <stop offset="100%" stopColor="#060e1e" />
                  </linearGradient>
                  <linearGradient
                    id="msg-sent"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#00a3ff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0080cc" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient
                    id="msg-recv"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#263348" />
                  </linearGradient>
                </defs>
                <rect
                  x="10"
                  y="10"
                  width="280"
                  height="240"
                  rx="12"
                  fill="url(#chat-bg)"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeOpacity="0.1"
                />
                <rect
                  x="10"
                  y="10"
                  width="280"
                  height="40"
                  rx="12"
                  fill="#0a1628"
                />
                <rect x="10" y="38" width="280" height="12" fill="#0a1628" />
                <circle
                  cx="36"
                  cy="30"
                  r="10"
                  fill="#00a3ff"
                  fillOpacity="0.2"
                  stroke="#00a3ff"
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                />
                <text
                  x="36"
                  y="34"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#00a3ff"
                >
                  🎬
                </text>
                <text
                  x="54"
                  y="27"
                  fontSize="7"
                  fill="white"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  CineWrap Support
                </text>
                <text
                  x="54"
                  y="37"
                  fontSize="5.5"
                  fill="#10b981"
                  fontFamily="sans-serif"
                >
                  ● Đang trực tuyến
                </text>
                {[260, 270, 280].map((x) => (
                  <circle
                    key={x}
                    cx={x}
                    cy="30"
                    r="2"
                    fill="white"
                    fillOpacity="0.3"
                  />
                ))}
                <rect
                  x="18"
                  y="58"
                  width="160"
                  height="28"
                  rx="8"
                  fill="url(#msg-recv)"
                />
                <text
                  x="28"
                  y="69"
                  fontSize="6"
                  fill="white"
                  opacity="0.9"
                  fontFamily="sans-serif"
                >
                  Xin chào! Tôi có thể
                </text>
                <text
                  x="28"
                  y="79"
                  fontSize="6"
                  fill="white"
                  opacity="0.9"
                  fontFamily="sans-serif"
                >
                  giúp gì cho bạn hôm nay?
                </text>
                <rect
                  x="112"
                  y="95"
                  width="166"
                  height="28"
                  rx="8"
                  fill="url(#msg-sent)"
                />
                <text
                  x="122"
                  y="106"
                  fontSize="6"
                  fill="white"
                  fontFamily="sans-serif"
                >
                  Phim của tôi bị giật,
                </text>
                <text
                  x="122"
                  y="116"
                  fontSize="6"
                  fill="white"
                  fontFamily="sans-serif"
                >
                  làm sao để khắc phục?
                </text>
                <rect
                  x="18"
                  y="132"
                  width="190"
                  height="40"
                  rx="8"
                  fill="url(#msg-recv)"
                />
                <text
                  x="28"
                  y="143"
                  fontSize="6"
                  fill="white"
                  opacity="0.9"
                  fontFamily="sans-serif"
                >
                  Bạn thử giảm chất lượng xuống
                </text>
                <text
                  x="28"
                  y="153"
                  fontSize="6"
                  fill="white"
                  opacity="0.9"
                  fontFamily="sans-serif"
                >
                  1080p trong Cài đặt &gt; Video nhé!
                </text>
                <text
                  x="28"
                  y="165"
                  fontSize="6"
                  fill="#00a3ff"
                  opacity="0.9"
                  fontFamily="sans-serif"
                >
                  Hướng dẫn chi tiết →
                </text>
                <rect
                  x="18"
                  y="182"
                  width="55"
                  height="20"
                  rx="10"
                  fill="#1e293b"
                />
                {[30, 40, 50].map((cx, i) => (
                  <circle
                    key={cx}
                    cx={cx}
                    cy="192"
                    r="3"
                    fill="#00a3ff"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.3;0.8;0.3"
                      dur="1.2s"
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
                <rect
                  x="10"
                  y="210"
                  width="280"
                  height="40"
                  rx="0"
                  fill="#060e1e"
                />
                <rect
                  x="10"
                  y="210"
                  width="280"
                  height="2"
                  fill="#ffffff"
                  fillOpacity="0.05"
                />
                <rect
                  x="18"
                  y="220"
                  width="220"
                  height="22"
                  rx="11"
                  fill="#1e293b"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeOpacity="0.1"
                />
                <text
                  x="32"
                  y="234"
                  fontSize="6"
                  fill="white"
                  opacity="0.3"
                  fontFamily="sans-serif"
                >
                  Nhập tin nhắn...
                </text>
                <circle
                  cx="264"
                  cy="231"
                  r="12"
                  fill="#00a3ff"
                  fillOpacity="0.8"
                />
                <polygon points="259,231 266,227 266,235" fill="white" />
              </svg>
            </div>

            <div className="relative z-10">
              <p className="text-cine-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-2">
                Luôn sẵn sàng hỗ trợ
              </p>
              <h3 className="text-white font-bold text-xl leading-snug mb-2">
                Điền form — nhận trả lời{" "}
                <span className="text-cine-primary">
                  tự động và nhanh chóng
                </span>
              </h3>
              <p className="text-cine-text-muted text-xs leading-relaxed">
                Mô tả chi tiết vấn đề giúp đội ngũ hỗ trợ xử lý nhanh hơn và
                chính xác hơn.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: Form glassmorphism */}
          <div className="relative rounded-2xl border border-white/10 bg-cine-bg-primary/40 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between overflow-hidden">
            <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-cine-secondary/8 rounded-full blur-[60px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-40 h-40 bg-cine-primary/5 rounded-full blur-[50px]" />

            <div className="relative z-10">
              <p className="text-cine-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-1">
                Gửi yêu cầu hỗ trợ
              </p>
              <h3 className="text-white font-bold text-xl mb-6">
                Mô tả thắc mắc của bạn
              </h3>

              {formSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-emerald-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                        strokeLinecap="round"
                      />
                      <polyline
                        points="22 4 12 14.01 9 11.01"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-emerald-400 font-bold text-lg">
                    Gửi thành công!
                  </p>
                  <p className="text-cine-text-muted text-sm leading-relaxed max-w-xs">
                    Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong
                    vòng{" "}
                    <span className="text-cine-text font-semibold">
                      2 giờ làm việc
                    </span>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSent(false);
                      setFormData({
                        name: "",
                        email: "",
                        category: "",
                        message: "",
                      });
                    }}
                    className="mt-2 text-xs text-cine-secondary hover:text-white transition-colors duration-200 underline underline-offset-2"
                  >
                    Gửi yêu cầu khác
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-cine-text-muted uppercase tracking-wider">
                        Họ và tên <span className="text-cine-warn">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 rounded-xl bg-cine-bg-secondary/60 border border-white/10 text-cine-text text-sm placeholder:text-cine-text-muted/50 focus:outline-none focus:border-cine-secondary/60 focus:bg-cine-bg-secondary/80 transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-cine-text-muted uppercase tracking-wider">
                        Địa chỉ email <span className="text-cine-warn">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-cine-bg-secondary/60 border border-white/10 text-cine-text text-sm placeholder:text-cine-text-muted/50 focus:outline-none focus:border-cine-secondary/60 focus:bg-cine-bg-secondary/80 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-cine-text-muted uppercase tracking-wider">
                      Danh mục cần hỗ trợ{" "}
                      <span className="text-cine-warn">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-cine-bg-secondary/60 border border-white/10 text-sm text-cine-text appearance-none focus:outline-none focus:border-cine-secondary/60 focus:bg-cine-bg-secondary/80 transition-all duration-200 cursor-pointer"
                      >
                        <option
                          value=""
                          className="bg-cine-bg-primary text-cine-text-muted"
                        >
                          -- Chọn danh mục --
                        </option>
                        <option value="video" className="bg-cine-bg-primary">
                          🎬 Sự cố phát phim & Chất lượng
                        </option>
                        <option value="account" className="bg-cine-bg-primary">
                          👤 Tài khoản & Thành viên
                        </option>
                        <option value="payment" className="bg-cine-bg-primary">
                          💳 Thanh toán & Hoàn tiền
                        </option>
                        <option value="security" className="bg-cine-bg-primary">
                          🔒 Bảo mật & Quyền riêng tư
                        </option>
                        <option value="content" className="bg-cine-bg-primary">
                          🎥 Nội dung & Bản quyền
                        </option>
                        <option value="other" className="bg-cine-bg-primary">
                          💬 Khác
                        </option>
                      </select>
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cine-text-muted pointer-events-none"
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
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-cine-text-muted uppercase tracking-wider">
                      Nội dung tin nhắn{" "}
                      <span className="text-cine-warn">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-cine-bg-secondary/60 border border-white/10 text-cine-text text-sm placeholder:text-cine-text-muted/50 focus:outline-none focus:border-cine-secondary/60 focus:bg-cine-bg-secondary/80 transition-all duration-200 resize-none leading-relaxed"
                    />
                    <p className="text-cine-text-muted text-xs self-end">
                      {formData.message.length}/500 ký tự
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleSubmitForm}
                    whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.97 }}
                    disabled={
                      formLoading ||
                      !formData.name ||
                      !formData.email ||
                      !formData.category ||
                      !formData.message
                    }
                    className={`relative w-full py-4 rounded-xl font-bold text-sm tracking-wider overflow-hidden transition-all duration-300 ${
                      formData.name &&
                      formData.email &&
                      formData.category &&
                      formData.message
                        ? "cursor-pointer shadow-lg shadow-cine-secondary/20"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cine-secondary via-[#0090e0] to-cine-secondary bg-[length:200%_100%] hover:bg-right transition-all duration-500" />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      {formLoading ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              d="M21 12a9 9 0 1 1-6.219-8.56"
                              strokeLinecap="round"
                            />
                          </svg>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line
                              x1="22"
                              y1="2"
                              x2="11"
                              y2="13"
                              strokeLinecap="round"
                            />
                            <polygon
                              points="22 2 15 22 11 13 2 9 22 2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Gửi yêu cầu hỗ trợ
                        </>
                      )}
                    </span>
                  </motion.button>

                  <p className="text-cine-text-muted text-xs text-center leading-relaxed">
                    Bằng cách gửi form, bạn đồng ý với{" "}
                    <a
                      href="#privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("privacy")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-cine-secondary hover:underline"
                    >
                      Chính sách bảo mật
                    </a>{" "}
                    của CineWrap.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
