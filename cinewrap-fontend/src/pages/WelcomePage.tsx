import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const scrollyTrackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div className="w-full text-cine-text font-sans bg-cine-bg selection:bg-cine-primary selection:text-cine-bg">
      {/* HEADER: Phân vùng thanh điều hướng chính đầu trang */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-cine-bg/90 backdrop-blur border-b border-white/10">
        <div className="text-2xl font-bold text-cine-secondary tracking-widest drop-shadow-md">
          CineWrap
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a
            href="#support"
            className="text-cine-text hover:text-cine-text-muted transition-colors duration-300"
          >
            Hỗ trợ
          </a>
          <a
            href="#about"
            className="text-cine-text hover:text-cine-text-muted transition-colors duration-300"
          >
            Giới thiệu
          </a>
          <a
            href="#general"
            className="text-cine-text hover:text-cine-text-muted transition-colors duration-300"
          >
            Thông tin chung
          </a>
          <a
            href="#privacy"
            className="text-cine-text hover:text-cine-text-muted transition-colors duration-300"
          >
            Chính sách bảo mật
          </a>
          <a
            href="#terms"
            className="text-cine-text hover:text-cine-text-muted transition-colors duration-300"
          >
            Điều khoản sử dụng
          </a>
        </nav>
      </header>

      {/* MAIN: Khối bao bọc toàn bộ nội dung cốt lõi của trang đích */}
      <main>
        {/* SECTION 1: Đường ray Scrollytelling chứa Video và Hero Content */}
        <section
          ref={scrollyTrackRef}
          className="relative w-full h-[200vh] z-10"
          aria-label="Giới thiệu điện ảnh cuộn phim"
        >
          {/* Khung viewport dính chặt tại đỉnh khi cuộn trong đường ray */}
          <div className="sticky top-0 w-full h-screen overflow-hidden bg-black flex flex-col justify-center items-center text-center px-4">
            {/* Lớp phủ điện ảnh (Cinema Overlay) */}
            <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />

            {/* Video cuộn phim chạy mượt theo khung hình */}
            <video
              ref={videoRef}
              src="/Cuonphim.mp4"
              className="absolute inset-0 w-full h-full object-cover opacity-75 z-0"
              muted
              playsInline
              preload="auto"
            />

            {/* Nội dung chính hiển thị đè lên Video */}
            <div className="relative z-20 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center mb-8"
              >
                {/* Logo dự án lấy từ thư mục src/assets thông qua module import hoặc public path */}
                <img
                  src="/image_e8e19b.png"
                  alt="CineWrap Logo"
                  className="w-36 md:w-52 mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                />
                {/* Khẩu hiệu khớp chuẩn 100% yêu cầu */}
                <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide drop-shadow-md">
                  Phim Hay Đóng Máy | It's a Wrap! Enjoy the Film
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onClick={() => navigate("/home")}
                className="px-12 py-4 bg-cine-secondary hover:bg-red-700 text-cine-text text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cine-secondary/30 active:scale-95"
              >
                Bắt đầu
              </motion.button>
            </div>
          </div>
        </section>

        {/* SECTION 2: Phân vùng thông tin chi tiết với màu nền Surface mới biệt lập */}
        <section className="relative z-20 w-full bg-cine-surface py-32 px-6 border-t border-white/5">
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
