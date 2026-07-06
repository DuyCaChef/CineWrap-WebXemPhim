import React, { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SeriesStatus = "new-episode" | "complete" | "ongoing";

interface Series {
  id: string;
  title: string;
  /** Poster dọc 2:3 — hiển thị nhỏ bên trái wide card */
  poster: string;
  /** Ảnh nền ngang — dùng làm backdrop mờ bên phải card trên desktop */
  backdrop: string;
  rating: string;
  genre: string;
  year: number;
  /** VD: "3 mùa · 36 tập" */
  seasons: string;
  /** Tóm tắt cực ngắn (1-2 dòng) */
  synopsis: string;
  /**
   * Trạng thái phát sóng:
   *  "new-episode" → Badge "Tập mới" đỏ cine-warn
   *  "complete"    → Badge "Trọn bộ" vàng cine-primary
   *  "ongoing"     → Badge "Đang chiếu" xanh cyan
   */
  status: SeriesStatus;
}

// ---------------------------------------------------------------------------
// Mock data — 8 series
// ---------------------------------------------------------------------------

const TOP_SERIES: Series[] = [
  {
    id: "ts-1",
    title: "Vương Triều Bóng Tối",
    poster:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop&auto=format",
    rating: "9.3",
    genre: "Hành động · Cung đình",
    year: 2024,
    seasons: "4 mùa · 48 tập",
    synopsis:
      "Cuộc tranh giành ngai vàng đẫm máu giữa các thế lực bí ẩn trong vương quốc chìm vào hỗn loạn.",
    status: "new-episode",
  },
  {
    id: "ts-2",
    title: "Mê Cung Vô Tận",
    poster:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&h=400&fit=crop&auto=format",
    rating: "9.0",
    genre: "Viễn tưởng · Bí ẩn",
    year: 2023,
    seasons: "3 mùa · 30 tập",
    synopsis:
      "Một nhóm khoa học gia mắc kẹt trong thực nghiệm thời gian sai lầm, phải tìm đường thoát trước khi vũ trụ sụp đổ.",
    status: "complete",
  },
  {
    id: "ts-3",
    title: "Thành Phố Không Ngủ",
    poster:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=400&fit=crop&auto=format",
    rating: "8.8",
    genre: "Hình sự · Noir",
    year: 2024,
    seasons: "2 mùa · 20 tập",
    synopsis:
      "Thám tử Minh đơn độc đối mặt với mạng lưới tội phạm xuyên quốc gia ẩn sau vẻ hào nhoáng của đô thị.",
    status: "new-episode",
  },
  {
    id: "ts-4",
    title: "Hơi Thở Cuối Cùng",
    poster:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&h=400&fit=crop&auto=format",
    rating: "8.6",
    genre: "Kinh dị · Tâm lý",
    year: 2023,
    seasons: "1 mùa · 8 tập",
    synopsis:
      "Sau tai nạn, một phụ nữ bắt đầu thấy ký ức của người đã hiến tạng cho mình — và sự thật đằng sau đó.",
    status: "complete",
  },
  {
    id: "ts-5",
    title: "Đế Chế Phương Đông",
    poster:
      "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=800&h=400&fit=crop&auto=format",
    rating: "8.5",
    genre: "Lịch sử · Sử thi",
    year: 2024,
    seasons: "5 mùa · 60 tập",
    synopsis:
      "Hành trình dựng nước gian khổ của một vị tướng trẻ từ bình dân vươn lên trở thành khai quốc công thần.",
    status: "ongoing",
  },
  {
    id: "ts-6",
    title: "Nhịp Đập Song Hành",
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&h=400&fit=crop&auto=format",
    rating: "8.2",
    genre: "Tình cảm · Học đường",
    year: 2024,
    seasons: "1 mùa · 16 tập",
    synopsis:
      "Hai ngôi sao âm nhạc đối lập về phong cách bị số phận đẩy vào cùng một ban nhạc cuối cùng của đời học sinh.",
    status: "new-episode",
  },
  {
    id: "ts-7",
    title: "Biên Giới Cuối Trời",
    poster:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&auto=format",
    rating: "8.0",
    genre: "Phiêu lưu · Sinh tồn",
    year: 2023,
    seasons: "2 mùa · 18 tập",
    synopsis:
      "Đội thám hiểm mắc kẹt giữa vùng lãnh nguyên không tên phải sinh tồn trước khi mùa đông cực hạn ập đến.",
    status: "complete",
  },
  {
    id: "ts-8",
    title: "Giai Điệu Phù Vân",
    poster:
      "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=400&h=600&fit=crop&auto=format",
    backdrop:
      "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&h=400&fit=crop&auto=format",
    rating: "7.9",
    genre: "Âm nhạc · Kịch tính",
    year: 2023,
    seasons: "3 mùa · 27 tập",
    synopsis:
      "Từ vỉa hè đến sân khấu quốc tế, câu chuyện về cái giá của danh vọng và những điều bị bỏ lại phía sau.",
    status: "ongoing",
  },
];

// ---------------------------------------------------------------------------
// Helpers — Badge config theo status
// ---------------------------------------------------------------------------

type BadgeConfig = {
  label: string;
  className: string;
};

const BADGE_CONFIG: Record<SeriesStatus, BadgeConfig> = {
  "new-episode": {
    label: "Tập mới",
    className: "bg-[#e50914] text-white",
  },
  complete: {
    label: "Trọn bộ",
    className: "bg-[#ffc107] text-[#0f172a]",
  },
  ongoing: {
    label: "Đang chiếu",
    className: "bg-[#00a3ff] text-white",
  },
};

// ---------------------------------------------------------------------------
// Sub-component: SeriesCard (Wide Card)
// ---------------------------------------------------------------------------

interface SeriesCardProps {
  series: Series;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series }) => {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE_CONFIG[series.status];

  return (
    <button
      type="button"
      aria-label={`Xem series ${series.title}, ${badge.label}`}
      className="group relative w-full overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? "0 4px 28px rgba(0, 163, 255, 0.18), 0 2px 12px rgba(0,0,0,0.4)"
          : "0 2px 10px rgba(0,0,0,0.25)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/*
        ── Nền backdrop mờ (chỉ hiện trên sm+) ──
        Tạo chiều sâu phía sau phần info text bên phải.
      */}
      <div className="absolute inset-0 hidden sm:block">
        <img
          src={series.backdrop}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Darken overlay dày từ trái (che poster) sang phải (để text đọc được) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b] via-[#1e293b]/95 to-[#1e293b]/70" />
        {/* Gradient dưới lên thêm để bottom luôn đủ tối */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/80 to-transparent" />
      </div>

      {/* Card nền solid trên mobile (không có backdrop) */}
      <div className="absolute inset-0 bg-[#1e293b] sm:hidden" />

      {/*
        ── Layout chính: poster trái + info phải ──
        relative z-10 để nổi lên trên backdrop
      */}
      <div className="relative z-10 flex items-stretch gap-3 p-3 sm:gap-4 sm:p-4">
        {/* ── Poster nhỏ bên trái ── */}
        <div className="relative flex-none">
          <div className="aspect-[2/3] h-28 overflow-hidden rounded-xl sm:h-32 lg:h-36">
            <img
              src={series.poster}
              alt={series.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>

          {/*
            ── Badge trạng thái ──
            Nằm chính xác góc trên bên trái của poster,
            dùng absolute bên trong relative của poster wrapper.
          */}
          <span
            className={[
              "absolute -top-1.5 -left-1.5",
              "rounded-md px-2 py-0.5",
              "text-[10px] font-extrabold tracking-wide",
              "shadow-md",
              badge.className,
            ].join(" ")}
          >
            {badge.label}
          </span>
        </div>

        {/* ── Thông tin bên phải ── */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
          {/* Tiêu đề */}
          <h3 className="line-clamp-1 text-sm font-bold leading-snug text-white sm:text-base lg:text-lg">
            {series.title}
          </h3>

          {/* Genre · Year */}
          <p className="text-xs text-[#9ca3af]">
            {series.genre}&nbsp;·&nbsp;{series.year}
          </p>

          {/* Tóm tắt (ẩn trên mobile nhỏ để gọn) */}
          <p className="hidden line-clamp-2 text-xs leading-relaxed text-[#9ca3af] sm:block lg:text-sm">
            {series.synopsis}
          </p>

          {/* Footer: Rating + Seasons */}
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            {/* Rating */}
            <span className="flex items-center gap-1 text-xs font-semibold text-[#ffc107]">
              <svg
                className="h-3 w-3 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {series.rating}
            </span>

            {/* Mùa / Tập */}
            <span className="flex items-center gap-1 text-xs text-[#9ca3af]">
              <svg
                className="h-3 w-3 flex-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              {series.seasons}
            </span>
          </div>
        </div>

        {/* ── Nút Play (hiện khi hover, chỉ desktop) ── */}
        <div
          className={[
            "hidden lg:flex flex-none items-center pr-1",
            "transition-all duration-300",
            "opacity-0 translate-x-2",
            "group-hover:opacity-100 group-hover:translate-x-0",
          ].join(" ")}
          aria-hidden="true"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffc107] shadow-lg shadow-[#ffc107]/30">
            <svg className="ml-0.5 h-5 w-5 fill-[#0f172a]" viewBox="0 0 20 20">
              <path d="M6.3 2.84A1 1 0 005 3.7v12.6a1 1 0 001.3.86l11-6.3a1 1 0 000-1.72l-11-6.3z" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Main component: TopSeries
// ---------------------------------------------------------------------------

const TopSeries: React.FC = () => {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
      {/* ── Section header ── */}
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div className="flex items-center gap-3">
          {/* Line accent vàng — phân biệt với cyan của các section phim lẻ */}
          <span
            aria-hidden="true"
            className="block h-6 w-[3px] rounded-full bg-[#ffc107] sm:h-7"
          />
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Phim Bộ Đình Đám
          </h2>
        </div>
        <button
          type="button"
          className={[
            "group inline-flex h-9 items-center justify-center gap-1.5 rounded-full",
            "border border-white/10 bg-white/5 px-3.5 text-xs font-semibold text-[#00a3ff]",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-sm",
            "transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3ff]",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]",
          ].join(" ")}
        >
          Xem tất cả
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 3.5L10 8l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/*
        ── Danh sách wide card ──
        Desktop (lg+): 2 cột lưới
        Mobile/Tablet: 1 cột xếp dọc
        Không dùng scroll ngang — wide card cần không gian đầy đủ để đọc
      */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {TOP_SERIES.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </section>
  );
};

export default TopSeries;
