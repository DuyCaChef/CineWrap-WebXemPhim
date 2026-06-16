import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Typo_CineWrap from "../../assets/images/Typo_CineWrap.png";

interface HeaderLandingProps {
  activeSection: string;
}

export const HeaderLanding: React.FC<HeaderLandingProps> = ({
  activeSection,
}) => {
  const navigate = useNavigate();

  // Hàm hỗ trợ cuộn mượt đến các section
  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "welcome", label: "Chào mừng" },
    { id: "general", label: "Thông tin chung" },
    { id: "privacy", label: "Chính sách bảo mật" },
    { id: "terms", label: "Điều khoản sử dụng" },
    { id: "support", label: "Hỗ trợ" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 px-6 py-4 flex justify-between items-center bg-cine-bg-primary/95 backdrop-blur-sm border-b border-white/10">
      <img
        src={Typo_CineWrap}
        alt="CineWrap Typo"
        className="w-32 md:w-52 mr-6 ml-3 md:ml-6 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <nav className="hidden text-[16px] md:flex gap-8 text-sm font-medium md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleScrollTo(e, link.id)}
            className={`text-cine-text hover:text-cine-text-muted transition-colors duration-200 ${
              activeSection === link.id
                ? "!text-cine-primary underline font-extrabold"
                : ""
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>

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
        className="flex items-center mr-8 gap-2 px-5 py-3 text-sm font-bold tracking-widest text-white uppercase bg-white/5 backdrop-blur-sm border border-white/20 rounded-full shadow-lg transition-colors duration-300"
      >
        <svg className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 24 24">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.75 11.25L10 18l-1.25-2.75L6 14l2.75-1.25L10 10l1.25 2.75L14 14l-2.75 1.25z" />
        </svg>
        <span>Trailer Hot</span>
      </motion.button>
    </header>
  );
};
