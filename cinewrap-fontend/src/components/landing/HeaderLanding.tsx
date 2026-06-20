import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Typo_CineWrap from "../../assets/images/Typo_CineWrap.png";

interface HeaderLandingProps {
  activeSection: string;
}

export const HeaderLanding: React.FC<HeaderLandingProps> = ({
  activeSection,
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false); // Tự động đóng menu trên mobile/tablet sau khi chọn
  };

  const navLinks = [
    { id: "welcome", label: "Chào mừng" },
    { id: "general", label: "Thông tin chung" },
    { id: "privacy", label: "Chính sách bảo mật" },
    { id: "terms", label: "Điều khoản sử dụng" },
    { id: "support", label: "Hỗ trợ" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 px-4 md:px-8 py-4 flex justify-between items-center bg-cine-bg-primary/95 backdrop-blur-sm border-b border-white/10">
      {/* ── CỘT TRÁI: LOGO ── */}
      <div className="flex w-auto lg:w-1/4 items-center">
        <img
          src={Typo_CineWrap}
          alt="CineWrap Typo"
          className="w-28 md:w-36 lg:w-44 cursor-pointer transition-all duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </div>

      {/* ── CỘT GIỮA: THANH ĐIỀU HƯỚNG (Chỉ hiện từ Desktop 1024px trở lên) ── */}
      <nav className="hidden lg:flex flex-1 justify-center items-center gap-5 xl:gap-8 text-[13px] xl:text-sm font-medium">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleScrollTo(e, link.id)}
            className={`text-cine-text hover:text-cine-text-muted transition-colors duration-200 whitespace-nowrap ${
              activeSection === link.id
                ? "!text-cine-primary underline underline-offset-4 font-extrabold"
                : ""
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* ── CỘT PHẢI: BUTTONS ── */}
      <div className="flex w-auto lg:w-1/4 items-center justify-end gap-3 md:gap-4">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#06b6d4",
            transition: { duration: 0.15, ease: "easeOut" },
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/TrailerHot")}
          className="flex items-center gap-2 px-3 py-3 md:px-5 md:py-2.5 text-[13px] font-bold tracking-widest text-white uppercase bg-white/5 backdrop-blur-sm border border-white/20 rounded-full shadow-lg transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 text-cyan-400 fill-current flex-shrink-0"
            viewBox="0 0 24 24"
          >
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.75 11.25L10 18l-1.25-2.75L6 14l2.75-1.25L10 10l1.25 2.75L14 14l-2.75 1.25z" />
          </svg>
          {/* Chữ "Trailer Hot" ẩn trên Mobile, hiện trên Tablet (md) và Desktop */}
          <span className="hidden md:block whitespace-nowrap">Trailer Hot</span>
        </motion.button>

        {/* Nút Hamburger (Ẩn trên Desktop lg:) */}
        <button
          className="lg:hidden p-2 text-cine-text hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* ── MOBILE & TABLET MENU DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/10 flex flex-col lg:hidden shadow-2xl overflow-hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollTo(e, link.id)}
                className={`px-6 py-4 border-b border-white/5 text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? "text-cine-primary bg-cine-primary/5 border-l-4 border-l-cine-primary"
                    : "text-cine-text hover:bg-white/5 hover:text-white border-l-4 border-l-transparent"
                }`}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
