import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Đường dẫn import sẽ phải lùi lại một thư mục (..) hoặc hai thư mục (../../) tùy cấu trúc của bạn
import { TypewriterText } from "../TypewriterText";
import Typo_CineWrap from "../../assets/images/Typo_CineWrap.png";
import Logo_CineWrap from "../../assets/images/Logo_CineWrap.png";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const scrollyTrackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Đưa toàn bộ logic tính toán cuộn video vào bên trong Component này
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollyTrackRef.current || !videoRef.current) return;

      const rect = scrollyTrackRef.current.getBoundingClientRect();
      const trackHeight = rect.height;

      const scrollOffset = -rect.top;
      const maxScrollInTrack = trackHeight - window.innerHeight;

      const rawFraction = scrollOffset / maxScrollInTrack;
      const scrollFraction = Math.max(0, Math.min(1, rawFraction));

      const duration = videoRef.current.duration;
      if (duration && !isNaN(duration)) {
        window.requestAnimationFrame(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = duration * scrollFraction;
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="welcome"
      ref={scrollyTrackRef}
      className="relative w-full h-[600vh] z-10"
      aria-label="Giới thiệu điện ảnh cuộn phim"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-cine-bg-primary flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 bg-cine-bg-primary/60 z-10 pointer-events-none" />

        <video
          ref={videoRef}
          src="/Cuonphim.mp4"
          className="absolute inset-0 w-full h-full object-cover contrast-110 z-0"
          muted
          playsInline
          preload="auto"
        />

        <div className="relative bottom-7 z-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center mb-8"
          >
            <img
              src={Logo_CineWrap}
              alt="CineWrap Logo"
              className="w-44 md:w-60 -mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
            />
            <img
              src={Typo_CineWrap}
              alt="CineWrap Typo"
              className="w-84 md:w-100 mb-7 drop-shadow-[0_10px_10px_rgba(0,0,0,1)]"
            />

            <TypewriterText
              text="Phim Hay Đóng Máy | It's a Wrap! Enjoy the Film"
              delayStart={0}
              className="text-xl md:text-2xl mb-4.5 text-gray-200 font-semibold tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,1)] text-center"
            />
            <TypewriterText
              text="Đến với CineWrap - Không chỉ là xem phim, đó là nghệ thuật thưởng thức!"
              delayStart={1.5}
              className="text-xl md:text-2xl text-gray-200 font-semibold tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,1)] text-center"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-cine-secondary hover:bg-cine-primary text-cine-text text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cine-secondary/30 active:scale-95"
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Bắt đầu thưởng thức ngay
          </motion.button>
        </div>
      </div>
    </section>
  );
};
