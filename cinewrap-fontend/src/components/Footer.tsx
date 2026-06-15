import React from "react";
import { useNavigate } from "react-router-dom";
// import Logo_CineWrap from "../assets/images/logo_CineWrap.png";
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
    <footer className="w-full bg-cine-bg-primary border-t border-white/5 text-cine-text-muted font-sans text-sm">
      {/* Khối nội dung chính phía trên */}
      <div className="max-w-8xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Cột 1: Thông tin thương hiệu (Chiếm 2 cột trên màn hình lớn) */}
        <div className="lg:col-span-2 flex flex-col items-start gap-5">
          <img
            src={Typo_CineWrap}
            alt="CineWrap Logo"
            className="w-44 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,163,255,0.2)]"
            onClick={() => navigate("/")}
          />
          <p className="text-xs leading-relaxed max-w-sm text-justify">
            CineWrap không chỉ là nơi xem phim — đây là không gian bạn sống cùng
            từng thước phim. Trải nghiệm điện ảnh đỉnh cao với hình ảnh 4K, âm
            thanh sống động trung thực ngay tại phòng khách của bạn.
          </p>
          {/* Mạng xã hội */}
          <div className="flex items-center gap-4 mt-2">
            {["facebook", "instagram", "youtube", "twitter"].map((social) => (
              <a
                key={social}
                href={`https://${social}.com`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-cine-bg-secondary border border-white/10 flex items-center justify-center text-cine-text hover:text-cine-secondary hover:border-cine-secondary transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="capitalize text-xs font-semibold">
                  {social[0]}
                </span>
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
                  className="hover:text-cine-primary cursor-pointer transition-colors duration-200"
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
                  className="hover:text-cine-secondary cursor-pointer transition-colors duration-200"
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
              <span className="text-cine-text font-medium block">
                Hỗ trợ dữ liệu:
              </span>
              <a
                href="mailto:privacy@cinewrap.vn"
                className="hover:text-cine-secondary transition-colors"
              >
                privacy@cinewrap.vn
              </a>
            </li>
            <li>
              <span className="text-cine-text font-medium block">
                Giải quyết khiếu nại:
              </span>
              <a
                href="mailto:legal@cinewrap.vn"
                className="hover:text-cine-primary transition-colors"
              >
                legal@cinewrap.vn
              </a>
            </li>
            <li className="text-[11px] text-cine-text-muted/70 leading-snug">
              Máy chủ vận hành tại Việt Nam. Tuân thủ tuyệt đối Luật An ninh
              mạng 2018.
            </li>
          </ul>
        </div>
      </div>

      {/* Khối bản quyền dưới cùng (Bottom Bar) */}
      <div className="w-full bg-[#090d16] py-6 px-6 border-t border-white/5">
        <div className="max-w-8xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            &copy; {currentYear}{" "}
            <span className="text-cine-text font-semibold tracking-wider">
              CineWrap
            </span>
            . Toàn bộ bản quyền được bảo lưu.
          </p>
          <div className="flex gap-6 text-cine-text-muted/60">
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
