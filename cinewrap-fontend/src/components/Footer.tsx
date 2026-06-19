import React from "react";
import { useNavigate } from "react-router-dom";
import Logo_CineWrap from "../assets/images/logo_CineWrap.png";
import Typo_CineWrap from "../assets/images/Typo_CineWrap.png";

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Hàm xử lý cuộn mượt cho Landing Page nếu đang ở WelcomePage
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // Nếu không tìm thấy ID (đang ở trang khác như /home), điều hướng về Welcome
      navigate("/");
    }
  };

  return (
    <footer className="w-full bg-cine-bg-primary border-t border-white/5 text-cine-text-muted font-sans text-sm relative overflow-hidden">
      {/* TỐI ƯU 1: Logo Background - Phóng to w-[120%] và giảm opacity-10 trên Mobile để tạo hiệu ứng Watermark tràn viền. Giữ w-[60%] và opacity-20 cho Tablet/Desktop */}
      <img
        src={Logo_CineWrap}
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-10 md:top-6 -translate-x-1/2 -translate-y-1/10 opacity-10 md:opacity-20 max-w-[520px] w-[120%] md:w-[60%] pointer-events-none z-0 transform scale-125 filter blur-sm brightness-90"
      />

      {/* Khối nội dung chính phía trên */}
      {/* TỐI ƯU 2: Giảm Padding (py-10) và Gap (gap-10) trên Mobile. Mở rộng lại từ Tablet (md:) */}
      <div className="relative z-10 max-w-8xl mx-auto px-6 py-10 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12">
        {/* Cột 1: Thông tin thương hiệu (Chiếm 2 cột trên màn hình lớn) */}
        <div className="lg:col-span-2 flex flex-col items-start gap-5">
          <img
            src={Typo_CineWrap}
            alt="CineWrap Typo"
            className="w-40 md:w-44 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,163,255,0.2)]"
            onClick={() => navigate("/")}
          />
          <p className="text-xs leading-relaxed max-w-sm text-justify">
            CineWrap không chỉ là nơi xem phim — đây là không gian bạn sống cùng
            từng thước phim. Trải nghiệm điện ảnh đỉnh cao với hình ảnh 4K, âm
            thanh sống động trung thực ngay tại phòng khách của bạn.
          </p>
          {/* Mạng xã hội */}
          <div className="flex items-center gap-4 mt-2">
            {[
              {
                id: "facebook",
                url: "https://facebook.com",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ),
              },
              {
                id: "instagram",
                url: "https://instagram.com",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24 ">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                ),
              },
              {
                id: "youtube",
                url: "https://youtube.com",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                ),
              },
              {
                id: "gmail",
                url: "mailto:support@cinewrap.vn",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                // Nút mượt mà và thân thiện với ngón tay trên mobile
                className="w-9 h-9 md:w-8 md:h-8 rounded-full bg-cine-bg-secondary border border-white/10 flex items-center justify-center text-cine-text hover:text-cine-secondary hover:border-cine-secondary transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Cột 2: Khám phá phim nhanh */}
        <div className="flex flex-col gap-4">
          <h4 className="text-cine-text font-bold uppercase tracking-wider text-lg border-l-2 border-cine-secondary pl-2.5">
            Khám phá
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs font-medium">
            {[
              "Phim Bộ Hot",
              "Phim Lẻ Bom Tấn",
              "Anime & Hoạt Hình",
              "Điện Ảnh Việt Nam",
              "Trailer Mới Nhất",
            ].map((item) => (
              <li key={item}>
                <span
                  onClick={() => navigate("/home")}
                  className="hover:text-cine-primary cursor-pointer transition-colors duration-200 block py-0.5"
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Phân vùng Landing điều hướng nhanh */}
        <div className="flex flex-col gap-4">
          <h4 className="text-cine-text font-bold uppercase tracking-wider text-lg border-l-2 border-cine-primary pl-2.5">
            Thông tin
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs font-medium">
            {[
              { label: "Tổng quan", id: "general" },
              { label: "Chính sách bảo mật", id: "privacy" },
              { label: "Điều khoản sử dụng", id: "terms" },
              { label: "Trung tâm hỗ trợ", id: "support" },
            ].map((item) => (
              <li key={item.id}>
                <span
                  onClick={() => handleScrollToSection(item.id)}
                  className="hover:text-cine-secondary cursor-pointer transition-colors duration-200 block py-0.5"
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 4: Liên hệ pháp lý */}
        <div className="flex flex-col gap-4">
          <h4 className="text-cine-text font-bold uppercase tracking-wider text-lg border-l-2 border-cine-warn pl-2.5">
            Liên hệ pháp lý
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-justify">
            <li>
              <span className="text-cine-text font-medium block mb-0.5">
                Hỗ trợ dữ liệu:
              </span>
              <a
                href="mailto:privacy@cinewrap.vn"
                className="hover:text-cine-secondary transition-colors inline-block"
              >
                privacy@cinewrap.vn
              </a>
            </li>
            <li>
              <span className="text-cine-text font-medium block mb-0.5">
                Giải quyết khiếu nại:
              </span>
              <a
                href="mailto:legal@cinewrap.vn"
                className="hover:text-cine-primary transition-colors inline-block"
              >
                legal@cinewrap.vn
              </a>
            </li>
            <li className="text-[11px] text-cine-text-muted/70 leading-snug pt-1">
              Máy chủ vận hành tại Việt Nam. Tuân thủ tuyệt đối Luật An ninh
              mạng 2018.
            </li>
          </ul>
        </div>
      </div>

      {/* Khối bản quyền dưới cùng (Bottom Bar) */}
      <div className="w-full bg-[#090d16] py-6 px-6 border-t border-white/5">
        {/* TỐI ƯU 3: Canh giữa text (text-center) trên Mobile để không bị thò thụt */}
        <div className="max-w-8xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
          <p>
            &copy; {currentYear}{" "}
            <span className="text-cine-text font-semibold tracking-wider">
              CineWrap
            </span>
            . Toàn bộ bản quyền được bảo lưu.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-cine-text-muted/60">
            <span className="hover:text-cine-text cursor-pointer transition-colors">
              Chính sách Cookie
            </span>
            <span className="hover:text-cine-text cursor-pointer transition-colors">
              Sơ đồ trang web
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
