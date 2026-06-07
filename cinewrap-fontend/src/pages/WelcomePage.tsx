import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TypewriterText } from "../components/TypewriterText";
import Typo_CineWrap from "../assets/images/Typo_CineWrap.png";
import Logo_CineWrap from "../assets/images/Logo_CineWrap.png";

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const scrollyTrackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<string>("welcome");

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollyTrackRef.current || !videoRef.current) return;

      // Lấy các chỉ số vị trí của khung chứa đường ray scrollytelling
      const rect = scrollyTrackRef.current.getBoundingClientRect();
      const trackHeight = rect.height;

      // Tính toán lượng pixel người dùng đã cuộn trong riêng phân đoạn này
      // Khi phần đầu của phân đoạn chạm đỉnh màn hình, scrollOffset bắt đầu từ 0
      const scrollOffset = -rect.top;
      const maxScrollInTrack = trackHeight - window.innerHeight;

      // Ràng buộc tỷ lệ cuộn chỉ nằm nghiêm ngặt trong khoảng từ 0 đến 1
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
    // Chạy kiểm tra một lần ngay khi mount đề phòng trường hợp trang bị reload giữa chừng
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrollspy: sử dụng vị trí cuộn để xác định chính xác phần nào đang hoạt động.
  useEffect(() => {
    const ids = ["welcome", "general", "privacy", "terms", "support"];
    let rafId: number | null = null;

    const updateActive = () => {
      const headerEl = document.querySelector("header");
      const headerHeight = headerEl
        ? (headerEl as HTMLElement).offsetHeight
        : 0;
      // Chĩa xuống phía dưới tiêu đề một chút để kiểm tra xem phần nào nằm "bên dưới" tiêu đề.
      const point = headerHeight + 20;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= point && rect.bottom >= point) {
          setActive(id);
          return;
        }
      }

      // Phương án dự phòng: chọn đoạn có đỉnh gần điểm nhất.
      let closest: { id: string; distance: number } | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - point);
        if (!closest || distance < closest.distance) closest = { id, distance };
      }
      if (closest) setActive(closest.id);
    };

    const onScroll = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActive);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once to initialise
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="w-full text-cine-text font-sans bg-cine-bg-primary selection:bg-cine-primary selection:text-cine-bg">
      {/* HEADER: Phân vùng thanh điều hướng chính đầu trang */}
      <header className="fixed top-0 left-0 w-full h-20 z-50 px-6 py-4 flex justify-between items-center bg-cine-bg-primary/95 backdrop-blur-sm border-b border-white/10">
        <img
          src={Typo_CineWrap}
          alt="CineWrap Typo"
          className="w-32 md:w-52 mr-6 ml-3 md:ml-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <nav className="hidden text-[16px] md:flex gap-8 text-sm font-medium md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <a
            href="#welcome"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("welcome")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-cine-text hover:text-cine-text-muted transition-colors duration-200 ${
              active === "welcome" ? "!text-cine-primary underline" : ""
            }`}
          >
            Chào mừng
          </a>
          <a
            href="#general"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("general")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-cine-text hover:text-cine-text-muted transition-colors duration-200 ${
              active === "general" ? "!text-cine-primary underline" : ""
            }`}
          >
            Thông tin chung
          </a>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("privacy")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-cine-text hover:text-cine-text-muted transition-colors duration-200 ${
              active === "privacy" ? "!text-cine-primary underline" : ""
            }`}
          >
            Chính sách bảo mật
          </a>
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("terms")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-cine-text hover:text-cine-text-muted transition-colors duration-200 ${
              active === "terms" ? "!text-cine-primary underline" : ""
            }`}
          >
            Điều khoản sử dụng
          </a>
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("support")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-cine-text hover:text-cine-text-muted transition-colors duration-200 ${
              active === "support" ? "!text-cine-primary underline" : ""
            }`}
          >
            Hỗ trợ
          </a>
        </nav>
      </header>

      {/* MAIN: Khối bao bọc toàn bộ nội dung cốt lõi của trang đích */}
      <main className="pt-20 relative w-full min-h-screen">
        {/* SECTION 1 (Chào mừng): Đường ray Scrollytelling chứa Video và Hero Content */}
        <section
          id="welcome"
          ref={scrollyTrackRef}
          className="relative w-full h-[300vh] z-10"
          aria-label="Giới thiệu điện ảnh cuộn phim"
        >
          {/* Khung viewport dính chặt tại đỉnh khi cuộn trong đường ray */}
          <div className="sticky top-0 w-full h-screen overflow-hidden bg-cine-bg-primary flex flex-col justify-center items-center text-center px-4">
            {/* Lớp phủ điện ảnh (Cinema Overlay) */}
            <div className="absolute inset-0 bg-cine-bg-primary/60 z-10 pointer-events-none" />

            {/* Video cuộn phim chạy mượt theo khung hình */}
            <video
              ref={videoRef}
              src="/Cuonphim.mp4"
              className="absolute inset-0 w-full h-full object-cover contrast-110 z-0"
              muted
              playsInline
              preload="auto"
            />

            {/* Nội dung chính hiển thị đè lên Video */}
            <div className="relative bottom-7 z-20 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center mb-8"
              >
                {/* Logo dự án  */}
                <img
                  src={Logo_CineWrap}
                  alt="CineWrap Logo"
                  className="w-44 md:w-60 -mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                />
                {/* Logo Typography */}
                <img
                  src={Typo_CineWrap}
                  alt="CineWrap Typo"
                  className="w-84 md:w-100 mb-7 drop-shadow-[0_10px_10px_rgba(0,0,0,1)]"
                />
                {/* Khẩu hiệu khớp chuẩn 100% yêu cầu */}
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
                transition={{ duration: 0.5, delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/home")}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-cine-secondary hover:bg-cine-primary text-cine-text text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cine-secondary/30 active:scale-95"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />{" "}
                  {/* Icon Play hình tam giác kinh điển */}
                </svg>
                Bắt đầu thưởng thức ngay
              </motion.button>
            </div>
          </div>
        </section>
        {/* SECTION 2: Phân vùng thông tin chi tiết với màu nền Surface mới biệt lập */}
        <section
          id="general"
          className="relative z-20 w-full bg-cine-surface py-32 px-6 border-t border-white/5"
        >
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-48">
            {/* Khối bài viết ngữ nghĩa số 1 */}
            <article className="w-full max-w-3xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold mb-6 text-cine-text"
              >
                Thế Giới Điện Ảnh Trong Tầm Tay
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-cine-text-muted leading-relaxed"
              >
                Khám phá hàng ngàn bộ phim bom tấn, từ hành động nghẹt thở đến
                những câu chuyện tình cảm sâu lắng. Trải nghiệm chất lượng hình
                ảnh sắc nét, mượt mà chưa từng có trên mọi thiết bị của bạn.
              </motion.p>
            </article>

            {/* Khối bài viết ngữ nghĩa số 2 */}
            <article className="w-full max-w-3xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold mb-6 text-cine-primary"
              >
                Trải Nghiệm Đỉnh Cao
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-cine-text-muted leading-relaxed"
              >
                Hệ thống truyền tải thông minh, không giật lag. Tìm kiếm và
                thưởng thức bộ phim yêu thích chỉ với vài cú click. Tham gia
                cùng cộng đồng những người đam mê điện ảnh thực thụ.
              </motion.p>
            </article>
          </div>
        </section>

        {/* Privacy, Terms, Support placeholder sections so nav can highlight when scrolled */}
        <section id="privacy" className="w-full py-40 px-6 bg-cine-surface/95">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-cine-text mb-4">
              Chính sách bảo mật
            </h3>
            <p className="text-cine-text-muted">
              Nội dung chính sách bảo mật...
            </p>
          </div>
        </section>

        <section id="terms" className="w-full py-40 px-6 bg-cine-surface/95">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-cine-text mb-4">
              Điều khoản sử dụng
            </h3>
            <p className="text-cine-text-muted">
              Nội dung điều khoản sử dụng...
            </p>
          </div>
        </section>

        <section id="support" className="w-full py-40 px-6 bg-cine-surface/95">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-cine-text mb-4">Hỗ trợ</h3>
            <p className="text-cine-text-muted">Thông tin liên hệ, FAQ...</p>
          </div>
        </section>
      </main>

      {/* FOOTER: Phân vùng chân trang chuẩn cấu trúc dự án doanh nghiệp */}
      <footer className="bg-cine-bg py-12 px-6 border-t border-white/5 text-center text-sm text-cine-text-muted">
        <p>
          &copy; {new Date().getFullYear()} CineWrap. Toàn bộ bản quyền được bảo
          lưu.
        </p>
      </footer>
    </div>
  );
};

export default IntroPage;
