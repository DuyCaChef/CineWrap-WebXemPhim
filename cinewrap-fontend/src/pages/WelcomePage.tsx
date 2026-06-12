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

  // Dữ liệu cho Section Privacy
  const [openPrivacy, setOpenPrivacy] = useState<string | null>(null);

  // Dữ liệu cho Section Terms
  const [openTerms, setOpenTerms] = useState<string | null>(null);
  const [activeTermsTab, setActiveTermsTab] = useState<"user" | "platform">(
    "user",
  );

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
              viewport={{ once: false, amount: 0.3 }}
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
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.5 }}
                className="md:col-span-2 bg-[#0d1527]/60 border border-white/10 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md min-h-[320px]"
              >
                {/* ── HIỆU ỨNG GRADIENT TRÒN (AMBIENT GLOW) ── */}
                {/* Đốm sáng góc trên trái (Màu xanh Cyan) */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-cine-secondary/20 rounded-full blur-[80px] pointer-events-none transition-all duration-700 group-hover:bg-cine-secondary/30 group-hover:scale-125" />

                {/* Đốm sáng góc dưới phải (Màu vàng Cam) */}
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cine-primary/10 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-cine-primary/20 group-hover:scale-110" />
                {/* ─────────────────────────────────────────────────── */}

                {/* Bọc nội dung chữ trong relative z-10 để nó luôn nổi bật trên lớp Glow */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-cine-primary mb-4">
                    Tầm nhìn của chúng tôi
                  </h3>
                  <p className="text-cine-text-muted text-sm leading-relaxed max-w-xl">
                    Chúng tôi tin rằng mỗi bộ phim là một tác phẩm nghệ thuật
                    cần được thưởng thức với độ phân giải hoàn hảo và âm thanh
                    trung thực nhất. CineWrap xóa bỏ ranh giới giữa rạp chiếu
                    chuyên nghiệp và phòng khách của bạn.
                  </p>
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
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.5, delay: 0.1 }}
                className="bg-gradient-to-br from-cine-primary/20 to-cine-secondary/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center justify-center backdrop-blur-md min-h-[320px]"
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
                <h3 className="text-xl font-bold text-cine-primary mb-3">
                  Góc phim yêu thích
                </h3>
                <p className="text-cine-text-muted text-justify text-sm leading-relaxed">
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
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 1.5, delay: i * 0.5 }}
                  className={`bg-gradient-to-l from-cine-primary/10 to-cine-secondary/5 border border-white/10 border-l-2 ${card.accent} rounded-2xl p-6 backdrop-blur-md flex flex-col gap-3`}
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
                viewport={{ once: false, amount: 0.3 }}
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
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.5 }}
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
              viewport={{ once: false, amount: 0.3 }}
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
                      <h4 className="text-base font-bold text-cine-primary mb-1.5">
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

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: CHÍNH SÁCH BẢO MẬT
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          id="privacy"
          className="relative z-20 w-full bg-cine-bg-secondary py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden"
        >
          {/* Ambient glow blobs — đồng bộ màu với section General */}
          <div className="pointer-events-none absolute top-0 right-1/4 w-[480px] h-[480px] bg-cine-primary/5 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute bottom-1/4 left-0 w-[360px] h-[360px] bg-cine-secondary/5 rounded-full blur-[100px]" />

          <div className="max-w-8xl mx-auto flex flex-col gap-20 relative">
            {/* ── HERO TAGLINE ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <div>
                <p className="text-cine-secondary text-xs uppercase tracking-[0.3em] font-semibold mb-4">
                  Dữ liệu của bạn, quyền của bạn
                </p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  Chính Sách <span className="text-cine-primary">Bảo Mật</span>
                </h2>
              </div>
              <p className="text-cine-text-muted text-sm leading-relaxed max-w-md md:text-right">
                Chúng tôi cam kết minh bạch về cách dữ liệu của bạn được thu
                thập, sử dụng và bảo vệ. Cập nhật lần cuối:{" "}
                <span className="text-cine-text font-semibold">11/06/2026</span>
              </p>
            </motion.div>

            {/* ── 4 STAT BADGES ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
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
                  value: "End-to-End",
                  label: "Mã hoá dữ liệu",
                  color: "text-cine-secondary",
                  bg: "bg-cine-secondary/10 border-cine-secondary/20",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="10" strokeLinecap="round" />
                      <path
                        d="M12 8v4l3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  value: "72 giờ",
                  label: "Thời gian xử lý yêu cầu",
                  color: "text-cine-primary",
                  bg: "bg-cine-primary/10 border-cine-primary/20",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                        strokeLinecap="round"
                      />
                      <circle cx="9" cy="7" r="4" strokeLinecap="round" />
                      <path
                        d="M23 21v-2a4 4 0 0 0-3-3.87"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16 3.13a4 4 0 0 1 0 7.75"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                  value: "Không bán",
                  label: "Dữ liệu cho bên thứ ba",
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10 border-emerald-500/20",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
                      <path
                        d="M19 6l-1 14H6L5 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                      <path
                        d="M9 6V4h6v2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  value: "Xoá ngay",
                  label: "Theo yêu cầu người dùng",
                  color: "text-cine-warn",
                  bg: "bg-cine-warn/10 border-cine-warn/20",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-4 p-5 rounded-2xl border ${stat.bg} backdrop-blur-md`}
                >
                  <div className={`flex-shrink-0 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className={`text-base font-extrabold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-cine-text-muted text-xs leading-snug">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ── ACCORDION CHI TIẾT ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1, delay: 0.15 }}
              className="flex flex-col gap-3"
            >
              {[
                {
                  id: "thu-thap",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="7 10 12 15 17 10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="12"
                        y1="15"
                        x2="12"
                        y2="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                  title: "1. Dữ liệu chúng tôi thu thập",
                  summary:
                    "Thông tin tài khoản, lịch sử xem, thiết bị và cookies cần thiết.",
                  content: (
                    <ul className="space-y-3 text-cine-text-muted text-sm leading-relaxed">
                      <li className="flex gap-3">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
                        <span>
                          <span className="text-cine-text font-semibold">
                            Thông tin tài khoản:
                          </span>{" "}
                          Họ tên, địa chỉ email, mật khẩu đã mã hoá, ảnh đại
                          diện (tùy chọn) khi bạn đăng ký hoặc cập nhật hồ sơ.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
                        <span>
                          <span className="text-cine-text font-semibold">
                            Hành vi sử dụng:
                          </span>{" "}
                          Phim đã xem, thời lượng xem, danh sách yêu thích và
                          các tương tác tìm kiếm nhằm cá nhân hóa gợi ý nội
                          dung.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
                        <span>
                          <span className="text-cine-text font-semibold">
                            Thiết bị & kết nối:
                          </span>{" "}
                          Loại thiết bị, hệ điều hành, trình duyệt, địa chỉ IP
                          ẩn danh và múi giờ để tối ưu hoá hiệu suất phát video.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
                        <span>
                          <span className="text-cine-text font-semibold">
                            Cookies thiết yếu:
                          </span>{" "}
                          Phiên đăng nhập, ngôn ngữ ưa thích và cài đặt chất
                          lượng video. Không dùng cookie theo dõi quảng cáo.
                        </span>
                      </li>
                    </ul>
                  ),
                },
                {
                  id: "su-dung",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" />
                      <path
                        d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                  title: "2. Cách chúng tôi sử dụng dữ liệu",
                  summary:
                    "Cá nhân hoá, cải thiện dịch vụ và bảo mật tài khoản — không quảng cáo.",
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {[
                        {
                          icon: "🎯",
                          title: "Cá nhân hoá nội dung",
                          desc: "Gợi ý phim phù hợp với lịch sử xem và thể loại yêu thích của bạn.",
                        },
                        {
                          icon: "⚙️",
                          title: "Cải thiện hệ thống",
                          desc: "Phân tích hiệu suất phát video và tốc độ tải để nâng cấp trải nghiệm.",
                        },
                        {
                          icon: "🔐",
                          title: "Bảo mật tài khoản",
                          desc: "Phát hiện đăng nhập bất thường và bảo vệ tài khoản khỏi truy cập trái phép.",
                        },
                        {
                          icon: "📩",
                          title: "Thông báo dịch vụ",
                          desc: "Gửi email về thay đổi chính sách, cập nhật bảo mật — không spam marketing.",
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex gap-3 p-4 bg-cine-bg-primary/50 rounded-xl border border-white/5"
                        >
                          <span className="text-xl flex-shrink-0">
                            {item.icon}
                          </span>
                          <div>
                            <p className="text-cine-text font-semibold mb-1">
                              {item.title}
                            </p>
                            <p className="text-cine-text-muted text-xs leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  id: "chia-se",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="18" cy="5" r="3" strokeLinecap="round" />
                      <circle cx="6" cy="12" r="3" strokeLinecap="round" />
                      <circle cx="18" cy="19" r="3" strokeLinecap="round" />
                      <line
                        x1="8.59"
                        y1="13.51"
                        x2="15.42"
                        y2="17.49"
                        strokeLinecap="round"
                      />
                      <line
                        x1="15.41"
                        y1="6.51"
                        x2="8.59"
                        y2="10.49"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                  title: "3. Chia sẻ với bên thứ ba",
                  summary:
                    "Dữ liệu của bạn không bao giờ được bán. Chia sẻ giới hạn và có kiểm soát.",
                  content: (
                    <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
                      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex gap-3">
                        <svg
                          className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
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
                        <p>
                          <span className="text-emerald-400 font-semibold">
                            Cam kết cốt lõi:
                          </span>{" "}
                          CineWrap tuyệt đối không bán, không cho thuê và không
                          trao đổi dữ liệu cá nhân của bạn với bất kỳ bên quảng
                          cáo nào.
                        </p>
                      </div>
                      <p>
                        Chúng tôi chỉ chia sẻ dữ liệu trong các trường hợp sau,
                        với phạm vi tối thiểu cần thiết:
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Nhà cung cấp dịch vụ đám mây (lưu trữ video, CDN) — có hợp đồng bảo mật dữ liệu ràng buộc.",
                          "Xử lý thanh toán — chỉ thông tin giao dịch, không lưu số thẻ trên hệ thống CineWrap.",
                          "Yêu cầu pháp lý hợp lệ từ cơ quan chức năng — có thông báo cho người dùng khi được phép.",
                        ].map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ),
                },
                {
                  id: "quyen",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="7" r="4" strokeLinecap="round" />
                    </svg>
                  ),
                  title: "4. Quyền của bạn",
                  summary:
                    "Truy cập, sửa, xuất hoặc xoá dữ liệu bất kỳ lúc nào.",
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      {[
                        {
                          icon: (
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path
                                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                strokeLinecap="round"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                strokeLinecap="round"
                              />
                            </svg>
                          ),
                          title: "Xem & Xuất",
                          desc: "Tải toàn bộ dữ liệu tài khoản dưới dạng JSON hoặc CSV từ trang Cài đặt.",
                          accent:
                            "border-cine-secondary/30 text-cine-secondary",
                        },
                        {
                          icon: (
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path
                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ),
                          title: "Chỉnh sửa",
                          desc: "Cập nhật thông tin cá nhân, sở thích nội dung và cài đặt thông báo trực tiếp.",
                          accent: "border-cine-primary/30 text-cine-primary",
                        },
                        {
                          icon: (
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <polyline
                                points="3 6 5 6 21 6"
                                strokeLinecap="round"
                              />
                              <path
                                d="M19 6l-1 14H6L5 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 11v6M14 11v6"
                                strokeLinecap="round"
                              />
                            </svg>
                          ),
                          title: "Xoá tài khoản",
                          desc: "Xoá toàn bộ dữ liệu vĩnh viễn trong vòng 30 ngày theo yêu cầu. Không thể hoàn tác.",
                          accent: "border-cine-warn/30 text-cine-warn",
                        },
                      ].map((right) => (
                        <div
                          key={right.title}
                          className={`p-5 rounded-xl border bg-cine-bg-primary/40 flex flex-col gap-3 ${right.accent.split(" ")[0]}`}
                        >
                          <div className={right.accent.split(" ")[1]}>
                            {right.icon}
                          </div>
                          <p className="text-cine-text font-semibold">
                            {right.title}
                          </p>
                          <p className="text-cine-text-muted text-xs leading-relaxed">
                            {right.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  id: "luu-tru",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <ellipse
                        cx="12"
                        cy="5"
                        rx="9"
                        ry="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                  title: "5. Lưu trữ & Bảo mật kỹ thuật",
                  summary:
                    "Máy chủ tại Việt Nam, mã hoá AES-256, kiểm tra bảo mật định kỳ.",
                  content: (
                    <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            label: "Vị trí lưu trữ",
                            value:
                              "Máy chủ đặt tại Việt Nam, tuân thủ Luật An ninh mạng 2018.",
                            icon: "🏛️",
                          },
                          {
                            label: "Chuẩn mã hoá",
                            value:
                              "AES-256 cho dữ liệu lưu trữ, TLS 1.3 cho dữ liệu truyền tải.",
                            icon: "🔐",
                          },
                          {
                            label: "Kiểm tra định kỳ",
                            value:
                              "Đánh giá bảo mật độc lập mỗi 6 tháng và vá lỗi tức thời khi phát hiện.",
                            icon: "🧪",
                          },
                          {
                            label: "Thời gian lưu trữ",
                            value:
                              "Dữ liệu hoạt động: trong suốt thời gian sử dụng. Dữ liệu log hệ thống: tối đa 90 ngày.",
                            icon: "📅",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex gap-3 p-4 bg-cine-bg-primary/50 rounded-xl border border-white/5"
                          >
                            <span className="text-lg flex-shrink-0">
                              {item.icon}
                            </span>
                            <div>
                              <p className="text-cine-text font-semibold mb-1">
                                {item.label}
                              </p>
                              <p className="text-xs leading-relaxed">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  id: "lien-he",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        strokeLinecap="round"
                      />
                      <polyline
                        points="22,6 12,13 2,6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  title: "6. Liên hệ về quyền riêng tư",
                  summary:
                    "Gửi yêu cầu hoặc khiếu nại về dữ liệu qua email hoặc form trực tiếp.",
                  content: (
                    <div className="space-y-4 text-sm">
                      <p className="text-cine-text-muted leading-relaxed">
                        Mọi yêu cầu liên quan đến quyền riêng tư — truy cập dữ
                        liệu, chỉnh sửa, xoá hoặc khiếu nại — sẽ được xử lý
                        trong vòng{" "}
                        <span className="text-cine-text font-semibold">
                          72 giờ làm việc
                        </span>
                        .
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href="mailto:privacy@cinewrap.vn"
                          className="flex items-center gap-2 px-5 py-3 rounded-full bg-cine-secondary/10 border border-cine-secondary/30 text-cine-secondary text-sm font-semibold hover:bg-cine-secondary/20 transition-colors"
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
                          privacy@cinewrap.vn
                        </a>
                        <a
                          href="#support"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById("support")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-center gap-2 px-5 py-3 rounded-full bg-cine-primary/10 border border-cine-primary/30 text-cine-primary text-sm font-semibold hover:bg-cine-primary/20 transition-colors"
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
                          Form hỗ trợ trực tiếp
                        </a>
                      </div>
                    </div>
                  ),
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.07 }}
                  className="bg-cine-bg-primary/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPrivacy(openPrivacy === item.id ? null : item.id)
                    }
                    className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                    aria-expanded={openPrivacy === item.id}
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-200 ${
                        openPrivacy === item.id
                          ? "bg-cine-primary/20 text-cine-primary"
                          : "bg-white/5 text-cine-text-muted group-hover:bg-cine-primary/10 group-hover:text-cine-primary"
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* Title + summary */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={` font-bold text-sm md:text-base duration-300 ${
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

                    {/* Chevron */}
                    <svg
                      className={`w-5 h-5 flex-shrink-0 text-cine-text-muted transition-transform duration-300 ${
                        openPrivacy === item.id
                          ? "rotate-180 text-cine-primary"
                          : ""
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

                  {/* Accordion Body — animate height */}
                  <motion.div
                    initial={false}
                    animate={
                      openPrivacy === item.id
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-white/5">
                      {item.content}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: ĐIỀU KHOẢN SỬ DỤNG
        ═══════════════════════════════════════════════════════════════════ */}

        <section
          id="terms"
          className="relative z-20 w-full bg-cine-bg-primary py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden"
        >
          {/* Ambient glow — đối xứng ngược chiều với section Privacy */}
          <div className="pointer-events-none absolute top-0 left-1/3 w-[500px] h-[500px] bg-cine-secondary/4 rounded-full blur-[130px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-cine-primary/4 rounded-full blur-[110px]" />

          <div className="max-w-8xl mx-auto flex flex-col gap-20 relative">
            {/* ── HERO TAGLINE ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <div>
                <p className="text-cine-secondary text-xs uppercase tracking-[0.3em] font-semibold mb-4">
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
              className="relative rounded-2xl overflow-hidden border border-cine-primary/20 bg-gradient-to-r from-cine-primary/10 via-cine-primary/5 to-transparent p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* Đường kẻ vàng bên trái */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-cine-primary rounded-l-2xl" />

              <div className="pl-4 flex-1">
                <p className="text-cine-primary font-bold text-base mb-1">
                  Tuân thủ điều khoản sử dụng khi truy cập và sử dụng dịch vụ
                  của CineWrap
                </p>
                <p className="text-cine-text-muted text-sm leading-relaxed">
                  Bạn được quyền xem phim hợp pháp, tôn trọng bản quyền và không
                  sử dụng nền tảng cho mục đích vi phạm pháp luật — đổi lại,
                  chúng tôi cung cấp dịch vụ ổn định, không quảng cáo và bảo vệ
                  dữ liệu của bạn.
                </p>
              </div>

              {/* 3 chip nhanh */}
              <div className="pl-4 md:pl-0 flex flex-wrap md:flex-col gap-2 flex-shrink-0">
                {[
                  { icon: "🤝", text: "Tôn trọng quyền riêng tư" },
                  { icon: "📜", text: "Cam kết minh bạch dịch vụ" },
                  { icon: "🔔", text: "Thông báo trước mọi thay đổi" },
                ].map((chip) => (
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

            {/* ── TAB CHUYỂN NHÓM: Người dùng / Nền tảng ───────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              {/* Tab bar — 2 nhánh */}
              <div className="flex gap-1 p-1 bg-cine-bg-secondary rounded-xl border border-white/8 self-start">
                {[
                  {
                    id: "user" as const,
                    label: "Quyền & Nghĩa vụ người dùng",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                          strokeLinecap="round"
                        />
                        <circle cx="12" cy="7" r="4" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    id: "platform" as const,
                    label: "Cam kết từ CineWrap",
                    icon: (
                      <svg
                        className="w-4 h-4"
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
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTermsTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
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

              {/* Tab content */}
              <motion.div
                key={activeTermsTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3"
              >
                {activeTermsTab === "user"
                  ? /* ─── NHÓM 1: NGƯỜI DÙNG ─── */
                    [
                      {
                        id: "dk-tai-khoan",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                              strokeLinecap="round"
                            />
                            <circle
                              cx="12"
                              cy="7"
                              r="4"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                        title: "1. Điều kiện tạo tài khoản",
                        summary:
                          "Độ tuổi tối thiểu, thông tin xác thực và trách nhiệm bảo mật.",
                        content: (
                          <ul className="space-y-3 text-cine-text-muted text-sm leading-relaxed">
                            {[
                              {
                                label: "Độ tuổi tối thiểu",
                                desc: "Bạn phải đủ 13 tuổi trở lên để đăng ký tài khoản. Người dùng dưới 18 tuổi cần có sự đồng ý của phụ huynh hoặc người giám hộ hợp pháp.",
                              },
                              {
                                label: "Thông tin trung thực",
                                desc: "Bạn cam kết cung cấp tên, email và thông tin thanh toán chính xác. Tài khoản được lập bằng thông tin giả mạo sẽ bị xoá mà không cần báo trước.",
                              },
                              {
                                label: "Bảo mật tài khoản",
                                desc: "Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động phát sinh từ tài khoản của mình. Hãy thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.",
                              },
                              {
                                label: "Mỗi người — một tài khoản",
                                desc: "Mỗi cá nhân chỉ được sở hữu một tài khoản. Việc tạo nhiều tài khoản để lách giới hạn dịch vụ là vi phạm điều khoản.",
                              },
                            ].map((item) => (
                              <li key={item.label} className="flex gap-3">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
                                <span>
                                  <span className="text-cine-text font-semibold">
                                    {item.label}:{" "}
                                  </span>
                                  {item.desc}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ),
                      },
                      {
                        id: "dk-su-dung",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <polygon
                              points="23 7 16 12 23 17 23 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <rect
                              x="1"
                              y="5"
                              width="15"
                              height="14"
                              rx="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                        title: "2. Quy tắc sử dụng nội dung",
                        summary:
                          "Những gì được phép và không được phép khi xem phim trên CineWrap.",
                        content: (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                              <p className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
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
                                Được phép
                              </p>
                              {[
                                "Xem phim cho mục đích cá nhân, phi thương mại",
                                "Chia sẻ đường link bài phim lên mạng xã hội",
                                "Tải xuống (nếu tính năng được kích hoạt) để xem offline",
                                "Viết đánh giá và bình luận mang tính xây dựng",
                              ].map((item) => (
                                <p
                                  key={item}
                                  className="text-cine-text-muted text-xs flex gap-2"
                                >
                                  <span className="text-emerald-400 flex-shrink-0">
                                    ·
                                  </span>
                                  {item}
                                </p>
                              ))}
                            </div>
                            <div className="p-4 rounded-xl border border-cine-warn/20 bg-cine-warn/5 space-y-2">
                              <p className="text-cine-warn font-bold mb-3 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <line
                                    x1="15"
                                    y1="9"
                                    x2="9"
                                    y2="15"
                                    strokeLinecap="round"
                                  />
                                  <line
                                    x1="9"
                                    y1="9"
                                    x2="15"
                                    y2="15"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                Không được phép
                              </p>
                              {[
                                "Ghi hình, chụp màn hình để phân phối lại",
                                "Dùng VPN hoặc proxy để lách giới hạn vùng nội dung",
                                "Bán lại hoặc cho thuê quyền truy cập tài khoản",
                                "Sử dụng bot, script để tự động duyệt hoặc tải nội dung",
                              ].map((item) => (
                                <p
                                  key={item}
                                  className="text-cine-text-muted text-xs flex gap-2"
                                >
                                  <span className="text-cine-warn flex-shrink-0">
                                    ·
                                  </span>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: "dk-thanh-toan",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="1"
                              y="4"
                              width="22"
                              height="16"
                              rx="2"
                              strokeLinecap="round"
                            />
                            <line
                              x1="1"
                              y1="10"
                              x2="23"
                              y2="10"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                        title: "3. Thanh toán & Hoàn tiền",
                        summary:
                          "Chính sách gói dịch vụ, gia hạn tự động và điều kiện hoàn tiền.",
                        content: (
                          <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {[
                                {
                                  icon: "🔄",
                                  label: "Gia hạn tự động",
                                  desc: "Gói đăng ký sẽ tự động gia hạn vào ngày hết hạn. Bạn có thể huỷ bất cứ lúc nào trước 24 giờ chu kỳ tiếp theo.",
                                  border: "border-cine-secondary/20",
                                },
                                {
                                  icon: "💳",
                                  label: "Phương thức thanh toán",
                                  desc: "Hỗ trợ thẻ tín dụng/ghi nợ, ví điện tử MoMo, ZaloPay và chuyển khoản ngân hàng nội địa.",
                                  border: "border-cine-primary/20",
                                },
                                {
                                  icon: "↩️",
                                  label: "Hoàn tiền",
                                  desc: "Chấp nhận yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày thanh toán nếu dịch vụ gặp sự cố kỹ thuật nghiêm trọng từ phía CineWrap.",
                                  border: "border-emerald-500/20",
                                },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className={`p-4 rounded-xl border ${item.border} bg-cine-bg-primary/40 flex flex-col gap-2`}
                                >
                                  <span className="text-xl">{item.icon}</span>
                                  <p className="text-cine-text font-semibold text-xs">
                                    {item.label}
                                  </p>
                                  <p className="text-xs leading-relaxed">
                                    {item.desc}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="p-4 rounded-xl border border-white/8 bg-cine-bg-primary/30 flex gap-3">
                              <svg
                                className="w-5 h-5 text-cine-primary flex-shrink-0 mt-0.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line
                                  x1="12"
                                  y1="8"
                                  x2="12"
                                  y2="12"
                                  strokeLinecap="round"
                                />
                                <line
                                  x1="12"
                                  y1="16"
                                  x2="12.01"
                                  y2="16"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <p className="text-xs leading-relaxed">
                                Giá gói dịch vụ có thể thay đổi. CineWrap sẽ
                                thông báo qua email ít nhất{" "}
                                <span className="text-cine-text font-semibold">
                                  30 ngày
                                </span>{" "}
                                trước khi mức giá mới có hiệu lực.
                              </p>
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: "dk-ban-quyen",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              strokeLinecap="round"
                            />
                            <path
                              d="M14.83 14.83a4 4 0 1 1 0-5.66"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                        title: "4. Bản quyền & Sở hữu trí tuệ",
                        summary:
                          "Toàn bộ nội dung được bảo hộ — vi phạm có thể bị xử lý pháp lý.",
                        content: (
                          <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
                            <p>
                              Tất cả nội dung trên CineWrap — bao gồm phim,
                              trailer, hình ảnh, logo, giao diện và mã nguồn —
                              đều thuộc quyền sở hữu của CineWrap hoặc được cấp
                              phép hợp lệ từ các đối tác phân phối.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                {
                                  type: "Nội dung phim",
                                  rule: "Bảo hộ theo Luật Sở hữu trí tuệ Việt Nam và Công ước Berne. Mọi hành vi sao chép, phân phối trái phép đều có thể bị truy cứu trách nhiệm hình sự.",
                                },
                                {
                                  type: "Giao diện & mã nguồn",
                                  rule: "Thiết kế giao diện, logo và toàn bộ mã nguồn front-end là tài sản độc quyền của CineWrap, không được sao chép hay tái sử dụng.",
                                },
                                {
                                  type: "Nội dung người dùng tạo",
                                  rule: "Bình luận và đánh giá bạn đăng lên CineWrap vẫn thuộc quyền sở hữu của bạn, nhưng bạn cấp cho chúng tôi giấy phép hiển thị trên nền tảng.",
                                },
                                {
                                  type: "Báo cáo vi phạm",
                                  rule: "Nếu phát hiện nội dung vi phạm bản quyền, vui lòng liên hệ copyright@cinewrap.vn — chúng tôi xử lý trong vòng 48 giờ.",
                                },
                              ].map((item) => (
                                <div
                                  key={item.type}
                                  className="p-4 rounded-xl border border-white/5 bg-cine-bg-primary/40 flex gap-3"
                                >
                                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-primary flex-shrink-0 mt-1.5" />
                                  <div>
                                    <p className="text-cine-text font-semibold mb-1 text-xs">
                                      {item.type}
                                    </p>
                                    <p className="text-xs leading-relaxed">
                                      {item.rule}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                      },
                    ].map((item, idx) => (
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
                          className="w-full flex items-center gap-4 px-6 py-5 text-left group"
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
                            className={`w-5 h-5 flex-shrink-0 text-cine-text-muted transition-transform duration-300 ${
                              openTerms === item.id
                                ? "rotate-180 text-cine-primary"
                                : ""
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
                        <motion.div
                          initial={false}
                          animate={
                            openTerms === item.id
                              ? { height: "auto", opacity: 1 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-white/5">
                            {item.content}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                  : /* ─── NHÓM 2: NỀN TẢNG ─── */
                    [
                      {
                        id: "cam-ket-dich-vu",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
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
                        ),
                        title: "5. Cam kết chất lượng dịch vụ",
                        summary:
                          "Uptime, tốc độ và tiêu chuẩn chất lượng CineWrap đảm bảo.",
                        content: (
                          <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {[
                                {
                                  value: "99.5%",
                                  label: "Uptime cam kết",
                                  color: "text-emerald-400",
                                  bg: "bg-emerald-500/10 border-emerald-500/20",
                                },
                                {
                                  value: "< 2s",
                                  label: "Thời gian tải trang",
                                  color: "text-cine-secondary",
                                  bg: "bg-cine-secondary/10 border-cine-secondary/20",
                                },
                                {
                                  value: "4K",
                                  label: "Độ phân giải tối đa",
                                  color: "text-cine-primary",
                                  bg: "bg-cine-primary/10 border-cine-primary/20",
                                },
                                {
                                  value: "24/7",
                                  label: "Giám sát hệ thống",
                                  color: "text-cine-text",
                                  bg: "bg-white/5 border-white/10",
                                },
                              ].map((stat) => (
                                <div
                                  key={stat.label}
                                  className={`p-4 rounded-xl border ${stat.bg} flex flex-col gap-1`}
                                >
                                  <p
                                    className={`text-xl font-extrabold ${stat.color}`}
                                  >
                                    {stat.value}
                                  </p>
                                  <p className="text-cine-text-muted text-xs">
                                    {stat.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <p>
                              Trong trường hợp downtime vượt quá mức cam kết,
                              CineWrap sẽ tự động gia hạn gói dịch vụ của bạn
                              tương ứng với thời gian gián đoạn, không cần yêu
                              cầu.
                            </p>
                          </div>
                        ),
                      },
                      {
                        id: "gioi-han-trach-nhiem",
                        icon: (
                          <svg
                            className="w-5 h-5"
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
                            <line
                              x1="12"
                              y1="8"
                              x2="12"
                              y2="12"
                              strokeLinecap="round"
                            />
                            <line
                              x1="12"
                              y1="16"
                              x2="12.01"
                              y2="16"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                        title: "6. Giới hạn trách nhiệm",
                        summary:
                          "Những trường hợp CineWrap không chịu trách nhiệm pháp lý.",
                        content: (
                          <div className="space-y-3 text-sm text-cine-text-muted leading-relaxed">
                            <p>
                              CineWrap cung cấp dịch vụ theo dạng "nguyên trạng"
                              và không chịu trách nhiệm trong các trường hợp
                              sau:
                            </p>
                            <ul className="space-y-2.5">
                              {[
                                "Mất dữ liệu do lỗi thiết bị hoặc kết nối internet phía người dùng.",
                                "Gián đoạn dịch vụ do sự cố bất khả kháng (thiên tai, chiến tranh mạng quy mô lớn, quyết định từ cơ quan nhà nước).",
                                "Nội dung bình luận của người dùng khác gây ảnh hưởng đến bạn — chúng tôi sẽ xử lý khi nhận được báo cáo.",
                                "Thiệt hại gián tiếp phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, ngoài phạm vi phí dịch vụ đã thanh toán.",
                              ].map((item) => (
                                <li key={item} className="flex gap-3">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cine-warn flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ),
                      },
                      {
                        id: "thay-doi-dk",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ),
                        title: "7. Thay đổi điều khoản",
                        summary:
                          "CineWrap thông báo trước ít nhất 30 ngày mỗi khi cập nhật điều khoản.",
                        content: (
                          <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
                            <div className="flex flex-col md:flex-row gap-4">
                              {[
                                {
                                  step: "01",
                                  title: "Soạn thảo cập nhật",
                                  desc: "Đội pháp lý soạn thảo và rà soát nội dung thay đổi.",
                                  color: "text-cine-secondary",
                                  border: "border-cine-secondary/30",
                                },
                                {
                                  step: "02",
                                  title: "Thông báo 30 ngày",
                                  desc: "Gửi email tóm tắt thay đổi đến toàn bộ tài khoản đang hoạt động.",
                                  color: "text-cine-primary",
                                  border: "border-cine-primary/30",
                                },
                                {
                                  step: "03",
                                  title: "Hiệu lực",
                                  desc: "Điều khoản mới có hiệu lực. Tiếp tục sử dụng đồng nghĩa với chấp thuận.",
                                  color: "text-emerald-400",
                                  border: "border-emerald-500/30",
                                },
                              ].map((step) => (
                                <div
                                  key={step.step}
                                  className={`flex-1 p-4 rounded-xl border ${step.border} bg-cine-bg-primary/40`}
                                >
                                  <p
                                    className={`text-2xl font-extrabold ${step.color} mb-2`}
                                  >
                                    {step.step}
                                  </p>
                                  <p className="text-cine-text font-semibold text-xs mb-1">
                                    {step.title}
                                  </p>
                                  <p className="text-xs leading-relaxed">
                                    {step.desc}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs">
                              Nếu bạn không đồng ý với điều khoản mới, bạn có
                              quyền huỷ tài khoản trước ngày hiệu lực và được
                              hoàn tiền phần dịch vụ chưa sử dụng theo tỷ lệ.
                            </p>
                          </div>
                        ),
                      },
                      {
                        id: "phap-luat",
                        icon: (
                          <svg
                            className="w-5 h-5"
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
                            <path
                              d="M9 12l2 2 4-4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ),
                        title: "8. Pháp luật áp dụng & Giải quyết tranh chấp",
                        summary:
                          "Tuân theo pháp luật Việt Nam, ưu tiên hoà giải trước khi khởi kiện.",
                        content: (
                          <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
                            <p>
                              Điều khoản này được điều chỉnh bởi pháp luật Cộng
                              hoà Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát
                              sinh sẽ được xử lý theo trình tự:
                            </p>
                            <ol className="space-y-3">
                              {[
                                {
                                  num: "1.",
                                  title: "Liên hệ trực tiếp",
                                  desc: "Gửi yêu cầu tới legal@cinewrap.vn — chúng tôi cam kết phản hồi trong 5 ngày làm việc.",
                                },
                                {
                                  num: "2.",
                                  title: "Hoà giải",
                                  desc: "Nếu không giải quyết được qua thư, hai bên đồng ý tiến hành hoà giải tại Trung tâm Hoà giải Thương mại Việt Nam (VMC).",
                                },
                                {
                                  num: "3.",
                                  title: "Toà án",
                                  desc: "Trường hợp hoà giải thất bại, tranh chấp được đưa ra Toà án nhân dân có thẩm quyền tại TP. Hồ Chí Minh.",
                                },
                              ].map((step) => (
                                <li key={step.num} className="flex gap-3">
                                  <span className="text-cine-primary font-extrabold flex-shrink-0">
                                    {step.num}
                                  </span>
                                  <span>
                                    <span className="text-cine-text font-semibold">
                                      {step.title}:{" "}
                                    </span>
                                    {step.desc}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ),
                      },
                    ].map((item, idx) => (
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
                          className="w-full flex items-center gap-4 px-6 py-5 text-left group"
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
                            className={`w-5 h-5 flex-shrink-0 text-cine-text-muted transition-transform duration-300 ${
                              openTerms === item.id
                                ? "rotate-180 text-cine-primary"
                                : ""
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
                        <motion.div
                          initial={false}
                          animate={
                            openTerms === item.id
                              ? { height: "auto", opacity: 1 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-white/5">
                            {item.content}
                          </div>
                        </motion.div>
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
              className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-2xl border border-white/8 bg-cine-bg-secondary/40 backdrop-blur-md"
            >
              <div>
                <p className="text-cine-text font-bold text-base mb-1">
                  Có thắc mắc về điều khoản?
                </p>
                <p className="text-cine-text-muted text-sm">
                  Đội ngũ hỗ trợ sẵn sàng giải đáp mọi câu hỏi pháp lý của bạn.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a
                  href="mailto:legal@cinewrap.vn"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-cine-secondary/10 border border-cine-secondary/30 text-cine-secondary text-sm font-semibold hover:bg-cine-secondary/20 transition-colors"
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
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-cine-primary/10 border border-cine-primary/30 text-cine-primary text-sm font-semibold hover:bg-cine-primary/20 transition-colors"
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
