import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TypewriterText } from "../components/TypewriterText";
import Typo_CineWrap from "../assets/images/Typo_CineWrap.png";
import Logo_CineWrap from "../assets/images/Logo_CineWrap.png";
import Popcorn from "../assets/images/popcorn.jpg";
import Cinemax_CineWrap from "../assets/images/CineWrap_Cinemax.png";

const WelcomePage: React.FC = () => {
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

  // Dữ liệu cho Section General và Tab nội dung chi tiết
  const [activeTab, setActiveTab] = useState("tong-quan");

  const FEATURE_CARDS = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M13 10V3L4 14h7v7l9-11h-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Tốc độ vượt trội",
      desc: "Công nghệ nén video tiên tiến giúp truyền tải hình ảnh 4K mượt mà ngay cả trên kết nối internet tiêu chuẩn, không giật lag.",
      accent: "border-l-cine-secondary",
      iconBg: "bg-cine-secondary/10 text-cine-secondary",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect
            x="2"
            y="3"
            width="20"
            height="14"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        </svg>
      ),
      title: "Đa nền tảng",
      desc: "Trải nghiệm đồng nhất từ Smart TV, máy tính bảng đến điện thoại di động — giao diện thích ứng hoàn hảo trên mọi thiết bị.",
      accent: "border-l-cine-primary",
      iconBg: "bg-cine-primary/10 text-cine-primary",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Bảo mật tuyệt đối",
      desc: "Quyền riêng tư và dữ liệu của bạn được bảo vệ bởi các tiêu chuẩn mã hóa end-to-end hàng đầu thế giới.",
      accent: "border-l-emerald-500",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
  ];

  const TABS = [
    { id: "tong-quan", label: "Tổng quan" },
    { id: "goi-dich-vu", label: "Gói dịch vụ" },
    { id: "tieu-chuan-dich-vu", label: "Tiêu chuẩn dịch vụ" },
    { id: "gia-tri-mang-lai", label: "Giá trị mang lại" },
  ];

  const TAB_ITEMS: Record<
    string,
    { icon: string; title: string; desc: string }[]
  > = {
    "tong-quan": [
      {
        icon: "🎬",
        title: "Điện ảnh theo cách của bạn",
        desc: "Mang đến giao diện hiện đại, tập trung vào trải nghiệm người dùng, CineWrap đã tái định nghĩa cách chúng ta thưởng thức điện ảnh tại nhà, giúp bạn dễ dàng hòa mình vào mạch cảm xúc của bộ phim.",
      },
      {
        icon: "🍿",
        title: "Khám phá không giới hạn",
        desc: "Không chỉ dừng lại ở việc phát video, nền tảng phân loại phim theo các chủ đề nghệ thuật, dòng thời gian và đạo diễn. Giúp người dùng dễ dàng tiếp cận những tác phẩm phù hợp với tâm trạng và gu thẩm mỹ riêng.",
      },
    ],
    "goi-dich-vu": [
      {
        icon: "🎟️",
        title: "Gói Cơ bản",
        desc: "Truy cập hàng nghìn bộ phim chất lượng HD với giá ưu đãi. Phù hợp cho người dùng cá nhân muốn khám phá CineWrap.",
      },
      {
        icon: "⭐",
        title: "Gói Premium",
        desc: "Truy cập nội dung 4K +, kho phim độc quyền và trải nghiệm dịch vụ không giới hạn.",
      },
    ],
    "tieu-chuan-dich-vu": [
      {
        icon: "📱",
        title: "Tương thích đa thiết bị",
        desc: "Hệ thống được thiết kế linh hoạt để hiển thị hoàn hảo từ màn hình lớn của máy tính đến các thiết bị di động nhỏ gọn. Bạn có thể chuyển đổi thiết bị xem liên tục mà không làm gián đoạn trải nghiệm.",
      },
      {
        icon: "👁️‍🗨️",
        title: "Trọn vẹn từng câu thoại",
        desc: "Hệ thống phụ đề được thiết kế với font chữ chuyên dụng, đổ bóng điện ảnh dễ đọc và đồng bộ chính xác theo từng khung hình, tôn trọng tuyệt đối ý đồ truyền tải của nhà làm phim.",
      },
    ],
    "gia-tri-mang-lai": [
      {
        icon: "🌱",
        title: "Không gian xem phim sạch",
        desc: "CineWrap nói không với các quảng cáo pop-up, banner che khuất tầm nhìn hay các liên kết độc hại thường gặp trên các web xem phim lậu. Mang đến một môi trường xem phim an toàn, sạch sẽ và văn minh.",
      },
      {
        icon: "🔒",
        title: "Bảo mật và Riêng tư",
        desc: "Toàn bộ lịch sử xem, danh sách phim yêu thích và thông tin tùy chỉnh cá nhân của bạn được lưu trữ an toàn, bảo mật tuyệt đối, đảm bảo quyền riêng tư trọn vẹn cho từng người dùng.",
      },
    ],
  };

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
              active === "welcome"
                ? "!text-cine-primary underline font-extrabold"
                : ""
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
              active === "general"
                ? "!text-cine-primary underline font-extrabold"
                : ""
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
              active === "privacy"
                ? "!text-cine-primary underline font-extrabold"
                : ""
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
              active === "terms"
                ? "!text-cine-primary underline font-extrabold"
                : ""
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
              active === "support"
                ? "!text-cine-primary underline font-extrabold"
                : ""
            }`}
          >
            Hỗ trợ
          </a>
        </nav>
        <motion.button
          // Hiệu ứng xuất hiện nhẹ nhàng khi load trang
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          // Hiệu ứng tương tác khi hover và bấm
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#06b6d4", // Đổi sang viền màu cyan khi hover để tiệp màu nút chính
            transition: { duration: 0.15, ease: "easeOut" },
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/TrailerHot")}
          // Style Tailwind: Nút kính mờ, viền mảnh, chữ viết hoa, bo góc thể thao
          className="flex items-center mr-8 gap-2 px-5 py-3 text-sm font-bold tracking-widest text-white uppercase bg-white/5 backdrop-blur-sm border border-white/20 rounded-full shadow-lg transition-colors duration-300"
        >
          {/* Icon ngọn lửa phát sáng đại diện cho chữ "HOT" */}
          <svg
            className="w-5 h-5 text-cyan-400 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.75 11.25L10 18l-1.25-2.75L6 14l2.75-1.25L10 10l1.25 2.75L14 14l-2.75 1.25z" />
          </svg>

          <span>Trailer Hot</span>
        </motion.button>
      </header>

      {/* MAIN: Khối bao bọc toàn bộ nội dung cốt lõi của trang đích */}
      <main className="pt-20 relative w-full min-h-screen">
        {/* SECTION 1 (Chào mừng): Đường ray Scrollytelling chứa Video và Hero Content */}
        <section
          id="welcome"
          ref={scrollyTrackRef}
          className="relative w-full h-[600vh] z-10"
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
                transition={{ duration: 1.5, ease: "easeOut" }}
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
                transition={{ duration: 1, delay: 0.4 }}
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

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: THÔNG TIN CHUNG
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          id="general"
          className="relative z-20 w-full bg-cine-bg-primary py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden"
        >
          {/* Ambient glow blobs — trang trí nền */}
          <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[500px] bg-cine-secondary/5 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-cine-primary/5 rounded-full blur-[100px]" />

          <div className="max-w-8xl mx-auto flex flex-col gap-28 relative">
            {/* ── PHẦN 1: Hero tagline ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full rounded-3xl overflow-hidden border border-white/10 p-8 md:p-16 lg:p-20 min-h-[400px] flex items-center shadow-2xl group cursor-pointer"
            >
              {/* LỚP 1: Hình ảnh nền (Nằm dưới cùng z-0) */}
              <motion.img
                src={Popcorn}
                alt="Background Trải Nghiệm Rạp Phim"
                className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75"
                // Hiệu ứng phóng to nhẹ ảnh nền khi rê chuột vào khung
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.8, ease: "easeOut" },
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* LỚP 2: Màng phủ Gradient mờ (Nằm giữa z-10) */}
              {/* Giúp bên trái tối màu để chữ nổi bật, bên phải trong suốt để thấy hình */}
              <div className="absolute inset-0 bg-gradient-to-r from-cine-bg-primary via-cine-bg-primary/80 to-transparent z-10 pointer-events-none" />

              {/* LỚP 3: Nội dung chữ (Nằm trên cùng z-20) */}
              <div className="relative z-20 w-full max-w-2xl text-left flex flex-col items-start pointer-events-none">
                {/* Dòng 1: Nghệ thuật điện ảnh */}
                <motion.p className="text-cine-secondary text-xs md:text-sm uppercase tracking-[0.3em] font-semibold mb-4 drop-shadow-md transition-transform duration-500 group-hover:-translate-y-1">
                  Nghệ thuật điện ảnh
                </motion.p>

                {/* Dòng 2: Mang trải nghiệm rạp phim về nhà */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg transition-transform duration-500 delay-75 group-hover:-translate-y-1">
                  Mang Trải Nghiệm <br className="hidden md:block" />
                  <span className="text-cine-primary">Rạp Phim</span> Về Nhà
                </h2>

                {/* Dòng 3: Đoạn văn mô tả */}
                <p className="text-gray-300 text-base md:text-lg leading-relaxed drop-shadow-md transition-transform duration-500 delay-100 group-hover:-translate-y-1">
                  CineWrap không chỉ là nơi xem phim — đây là không gian bạn
                  sống cùng từng thước phim. Trang web mang lại cho bạn trải
                  nghiệm xem phim thú vị, sống động và chân thực nhất, với chất
                  lượng hình ảnh và âm thanh đỉnh cao, ngay tại phòng khách của
                  bạn.
                </p>
              </div>
            </motion.div>

            {/* ── PHẦN 2: Bento Grid ──────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card lớn: Tầm nhìn */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="md:col-span-2 bg-[#0d1527]/60 border border-white/10 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md min-h-[320px]"
              >
                <div>
                  <h3 className="text-2xl font-bold text-cine-text mb-4">
                    Tầm nhìn của chúng tôi
                  </h3>
                  <p className="text-cine-text-muted text-sm leading-relaxed max-w-xl">
                    Chúng tôi tin rằng mỗi bộ phim là một tác phẩm nghệ thuật
                    cần được thưởng thức với độ phân giải hoàn hảo và âm thanh
                    trung thực nhất. CineWrap xóa bỏ ranh giới giữa rạp chiếu
                    chuyên nghiệp và phòng khách của bạn.
                  </p>
                </div>
                {/* Decorative wave SVG */}
                <div className="absolute right-0 bottom-12 w-1/2 opacity-20 pointer-events-none">
                  <svg viewBox="0 0 200 100" className="w-full h-auto">
                    <path
                      d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50"
                      fill="none"
                      stroke="#00a3ff"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,50 Q25,70 50,50 T100,50 T150,50 T200,50"
                      fill="none"
                      stroke="#ffc107"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                {/* Stat badges - Huy hiệu thống kê */}
                <div className="flex gap-8 mt-8 border-t border-white/5 pt-6">
                  {[
                    { value: "4K+", label: "Độ phân giải" },
                    { value: "Dolby", label: "Âm thanh vòm" },
                    { value: "5K+", label: "Đầu phim" },
                    { value: "4M+", label: "Người dùng" },
                  ].map((s) => (
                    <div key={s.label}>
                      <span className="text-xl md:text-2xl font-extrabold text-cine-text block">
                        {s.value}
                      </span>
                      <span className="text-xs text-cine-text-muted uppercase tracking-wider">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card dọc: Góc phim yêu thích */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.1 }}
                className="bg-[#0d1527]/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center justify-center backdrop-blur-md min-h-[320px]"
              >
                <div className="w-14 h-14 rounded-full bg-cine-primary/10 flex items-center justify-center mb-6 border border-cine-primary/25 shadow-[0_0_20px_rgba(255,193,7,0.15)]">
                  <svg
                    className="w-7 h-7 text-cine-primary"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-cine-text mb-3">
                  Góc phim yêu thích
                </h3>
                <p className="text-cine-text-muted text-sm leading-relaxed">
                  Kho dữ liệu mẫu được tổng hợp từ những bộ phim điện ảnh kinh
                  điển và các đoạn trailer bom tấn hot nhất. Đa dạng thể loại và
                  điện ảnh các nước Mỹ, Hàn, Nhật, Trung, Việt,... Tất cả được
                  sắp xếp theo các danh mục trực quan để phục vụ cho việc kiểm
                  thử tính năng tìm kiếm và phân loại nội dung.
                </p>
              </motion.div>

              {/* 3 Feature cards hàng dưới */}
              {FEATURE_CARDS.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: i * 0.5 }}
                  className={`bg-[#0d1527]/60 border border-white/10 border-l-2 ${card.accent} rounded-2xl p-6 backdrop-blur-md flex flex-col gap-3`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                  <h4 className="text-base font-bold text-cine-text">
                    {card.title}
                  </h4>
                  <p className="text-cine-text-muted text-xs leading-relaxed">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ── PHẦN 3: Showcase (hình trái + checklist phải) ───────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Trái: Cinema mockup */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="relative"
              >
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group aspect-video flex items-center justify-center">
                  <img
                    src={Cinemax_CineWrap}
                    alt="Trải nghiệm điện ảnh CineWrap"
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Quality badge */}
                  <div className="absolute bottom-4 right-4 bg-cine-primary text-cine-bg-primary text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[0_0_16px_rgba(255,193,7,0.4)]">
                    4K · Dolby
                  </div>
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-2xl border border-cine-secondary/10 pointer-events-none" />
              </motion.div>

              {/* Phải: Text + checklist */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex flex-col justify-center"
              >
                <p className="text-cine-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
                  Cam kết chất lượng
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-cine-text mb-5 leading-tight">
                  Định nghĩa lại trải nghiệm xem
                </h3>
                <div className="text-cine-text-muted text-sm leading-relaxed space-y-4 mb-8">
                  <p>
                    Chúng tôi hiểu rằng điện ảnh không chỉ là hình ảnh chuyển
                    động; đó là cảm xúc, là sự kết nối. Tại CineWrap, chúng tôi
                    tập trung vào những chi tiết nhỏ nhất — từ cách hiển thị phụ
                    đề thanh thoát đến việc điều chỉnh chính xác tông màu HDR
                    theo đúng ý đồ của đạo diễn.
                  </p>
                  <p>
                    Với chúng tôi, "Thông tin chung" không chỉ là dữ liệu. Đó là
                    lời cam kết về sự minh bạch và chất lượng phục vụ không
                    ngừng nghỉ.
                  </p>
                </div>
                <ul className="space-y-3.5">
                  {[
                    "Không quảng cáo gây gián đoạn",
                    "Hỗ trợ âm thanh không nén (Lossless)",
                    "Cập nhật nội dung đặc quyền hàng tuần",
                    "Gợi ý phim thông minh theo sở thích",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-medium text-cine-text"
                    >
                      <span className="w-5 h-5 rounded-full bg-cine-primary/10 border border-cine-primary/40 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-cine-primary"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* ── PHẦN 4: Tabs thông tin chi tiết ────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full border-t border-white/5 pt-20 flex flex-col items-center"
            >
              <div className="text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-cine-text mb-2">
                  Thông tin chi tiết
                </h3>
                <p className="text-cine-text-muted text-sm">
                  Mọi điều bạn cần biết về hệ sinh thái CineWrap
                </p>
              </div>

              {/* Tab bar */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-0 border-b border-white/10 pb-px mb-8 w-full max-w-2xl">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-sm py-3 px-4 md:px-6 transition-all relative font-medium ${
                      activeTab === tab.id
                        ? "text-cine-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-cine-primary after:content-['']"
                        : "text-cine-text-muted hover:text-cine-text"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl flex flex-col gap-4"
              >
                {TAB_ITEMS[activeTab].map((item) => (
                  <div
                    key={item.title}
                    className="bg-cine-bg-secondary border border-white/5 rounded-xl p-5 flex items-start gap-4 hover:border-white/10 transition-colors duration-200"
                  >
                    <div className="p-3 rounded-lg bg-cine-surface text-xl flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-cine-text mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-cine-text-muted text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
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

export default WelcomePage;
