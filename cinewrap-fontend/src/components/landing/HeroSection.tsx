import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { TypewriterText } from "../TypewriterText";
import Typo_CineWrap from "../../assets/images/Typo_CineWrap.png";
import Logo_CineWrap from "../../assets/images/Logo_CineWrap.png";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const scrollyTrackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      <div className="relative sticky top-0 w-full h-screen overflow-hidden bg-cine-bg-primary">
        <div className="absolute inset-0 bg-cine-bg-primary/60 z-10 pointer-events-none" />

        <video
          ref={videoRef}
          src="/Cuonphim.mp4"
          className="absolute inset-0 w-full h-full object-contain lg:object-cover contrast-110 z-0 transition-all duration-500"
          muted
          playsInline
          preload="auto"
        />

        <div className="absolute inset-0 z-20 w-full h-full">
          {/* ── HIỆU ỨNG ÁNH SÁNG AMBIENT GLOW (Mới thêm) ── */}
          {/* Ánh sáng mờ hắt từ đỉnh màn hình xuống */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[35vh] bg-gradient-to-b from-cine-secondary/25 to-transparent blur-[70px] pointer-events-none lg:opacity-60" />
          <div className="absolute top-[-5%] left-1/4 w-[60vw] h-[30vh] bg-cine-secondary/20 rounded-[100%] blur-[90px] pointer-events-none lg:hidden" />

          {/* Ánh sáng mờ hắt từ đáy màn hình lên */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[40vh] bg-gradient-to-t from-cine-primary/15 to-transparent blur-[70px] pointer-events-none lg:opacity-60" />
          <div className="absolute bottom-[-10%] right-1/4 w-[70vw] h-[35vh] bg-cine-primary/20 rounded-[100%] blur-[100px] pointer-events-none lg:hidden" />

          {/* ── CỤM 1: LOGO & TYPO ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 w-full flex flex-col items-center pt-16 px-4 text-center lg:relative lg:top-auto lg:w-auto lg:transform-none lg:pt-0 lg:mb-8 lg:z-0 lg:mt-[10vh]"
          >
            <img
              src={Logo_CineWrap}
              alt="CineWrap Logo"
              className="w-32 md:w-44 lg:w-60 -mb-4 md:-mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
            />
            <img
              src={Typo_CineWrap}
              alt="CineWrap Typo"
              className="w-64 md:w-84 lg:w-100 mb-5 md:mb-7 drop-shadow-[0_10px_10px_rgba(0,0,0,1)]"
            />
          </motion.div>

          {/* ── CỘM 2: TEXT TYPEWRITER ── */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center px-6 text-center lg:relative lg:inset-auto lg:top-auto lg:transform-none lg:w-auto lg:z-0 lg:px-0 lg:mt-4 lg:mb-6">
            <TypewriterText
              text="Phim Hay Đóng Máy | It's a Wrap! Enjoy the Film"
              delayStart={0}
              className="text-xs sm:text-sm md:text-xl lg:text-2xl mb-3 md:mb-4.5 text-gray-200 font-semibold tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,1)]"
            />
            <TypewriterText
              text="Đến với CineWrap - Không chỉ là xem phim, đó là nghệ thuật thưởng thức!"
              delayStart={1.5}
              className="text-xs sm:text-sm md:text-xl lg:text-2xl text-gray-200 font-semibold tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,1)]"
            />
          </div>

          {/* ── CỘM 3: ACTION BUTTON ── */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pb-32 px-4 lg:relative lg:bottom-auto lg:w-auto lg:z-0 lg:pb-0 lg:mt-2 lg:mb-12">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 mt-2 md:mt-0 bg-cine-secondary hover:bg-cine-primary text-cine-text text-base md:text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cine-secondary/30 active:scale-95 whitespace-nowrap"
            >
              <svg
                className="w-6 h-6 md:w-8 md:h-8 fill-current flex-shrink-0"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Bắt đầu thưởng thức ngay
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
