import React, { useState } from "react";
import { motion } from "framer-motion";

// 1. Import hình ảnh
import Popcorn from "../../assets/images/popcorn.jpg";
import Cinemax_CineWrap from "../../assets/images/CineWrap_Cinemax.png";

// 2. Import dữ liệu tĩnh
import { FEATURE_CARDS, TABS, TAB_ITEMS } from "../../constants/landingData";

export const GeneralSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <section
      id="general"
      // TỐI ƯU 1: Giảm padding dọc trên Mobile (py-16), giữ nguyên py-24 cho Tablet/PC
      className="relative z-20 w-full bg-cine-bg-primary py-16 md:py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[500px] bg-cine-secondary/5 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-cine-primary/5 rounded-full blur-[100px]" />

      {/* TỐI ƯU 2: Giảm gap giữa các khối lớn trên Mobile (gap-16), Desktop giữ gap-28 */}
      <div className="max-w-8xl mx-auto flex flex-col gap-16 lg:gap-28 relative">
        {/* ── PHẦN 1: Hero tagline ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full rounded-3xl overflow-hidden border border-white/10 p-8 md:p-16 lg:p-20 min-h-[400px] flex items-center shadow-2xl group cursor-pointer"
        >
          <motion.img
            src={Popcorn}
            alt="Background Trải Nghiệm Rạp Phim"
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cine-bg-primary via-cine-bg-primary/80 to-transparent z-10 pointer-events-none" />

          <div className="relative z-20 w-full max-w-2xl text-left flex flex-col items-start pointer-events-none">
            <motion.p className="text-cine-secondary text-xs md:text-sm uppercase tracking-[0.3em] font-semibold mb-4 drop-shadow-md transition-transform duration-500 group-hover:-translate-y-1">
              Nghệ thuật điện ảnh
            </motion.p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg transition-transform duration-500 delay-75 group-hover:-translate-y-1">
              Mang Trải Nghiệm <br className="hidden md:block" />
              <span className="text-cine-primary">Rạp Phim</span> Về Nhà
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed drop-shadow-md transition-transform duration-500 delay-100 group-hover:-translate-y-1">
              CineWrap không chỉ là nơi xem phim — đây là không gian bạn sống
              cùng từng thước phim. Trang web mang lại cho bạn trải nghiệm xem
              phim thú vị, sống động và chân thực nhất, với chất lượng hình ảnh
              và âm thanh đỉnh cao, ngay tại phòng khách của bạn.
            </p>
          </div>
        </motion.div>

        {/* ── PHẦN 2: Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.5 }}
            className="md:col-span-2 bg-[#0d1527]/60 border border-white/10 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md min-h-[320px]"
          >
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-cine-secondary/20 rounded-full blur-[80px] pointer-events-none transition-all duration-700 group-hover:bg-cine-secondary/30 group-hover:scale-125" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cine-primary/10 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-cine-primary/20 group-hover:scale-110" />

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-cine-primary mb-4">
                Tầm nhìn của chúng tôi
              </h3>
              <p className="text-cine-text-muted text-sm leading-relaxed max-w-xl">
                Chúng tôi tin rằng mỗi bộ phim là một tác phẩm nghệ thuật cần
                được thưởng thức với độ phân giải hoàn hảo và âm thanh trung
                thực nhất. CineWrap xóa bỏ ranh giới giữa rạp chiếu chuyên
                nghiệp và phòng khách của bạn.
              </p>
            </div>

            {/* TỐI ƯU 3: Đổi flex dàn ngang thành lưới (grid) 2 cột trên Mobile, 4 cột trên thiết bị lớn */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mt-8 border-t border-white/5 pt-6 relative z-10">
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
              Kho dữ liệu mẫu được tổng hợp từ những bộ phim điện ảnh kinh điển
              và các đoạn trailer bom tấn hot nhất. Đa dạng thể loại và điện ảnh
              các nước Mỹ, Hàn, Nhật, Trung, Việt,... Tất cả được sắp xếp theo
              các danh mục trực quan.
            </p>
          </motion.div>

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

        {/* ── PHẦN 3: Showcase ── */}
        {/* TỐI ƯU 4: Giảm gap xuống gap-8 trên Mobile/Tablet để nhường không gian cho cột chữ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
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
              <div className="absolute bottom-4 right-4 bg-cine-primary text-cine-bg-primary text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[0_0_16px_rgba(255,193,7,0.4)]">
                4K · Dolby
              </div>
            </div>
            <div className="absolute -inset-3 rounded-2xl border border-cine-secondary/10 pointer-events-none" />
          </motion.div>

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
                Chúng tôi hiểu rằng điện ảnh không chỉ là hình ảnh chuyển động;
                đó là cảm xúc, là sự kết nối. Tại CineWrap, chúng tôi tập trung
                vào những chi tiết nhỏ nhất — từ cách hiển thị phụ đề thanh
                thoát đến việc điều chỉnh chính xác tông màu HDR.
              </p>
              <p>
                Với chúng tôi, "Thông tin chung" không chỉ là dữ liệu. Đó là lời
                cam kết về sự minh bạch và chất lượng phục vụ.
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

        {/* ── PHẦN 4: Tabs thông tin chi tiết ── */}
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
  );
};
