import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecommendedMovie {
  id: string;
  title: string;
  /** Poster dọc tỷ lệ 2:3 từ Unsplash */
  poster: string;
  rating: string;
  genre: string;
  year: number;
  /**
   * Micro-copy cá nhân hóa — lý do gợi ý phim này.
   * VD: "Vì bạn đã xem Inception"
   */
  reason: string;
}

// ---------------------------------------------------------------------------
// Mock data (8 phim gợi ý)
// ---------------------------------------------------------------------------

const RECOMMENDED_MOVIES: RecommendedMovie[] = [
  {
    id: "rc-1",
    title: "Mê Cung Ký Ức",
    poster:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop&auto=format",
    rating: "8.6",
    genre: "Viễn tưởng",
    year: 2023,
    reason: "Vì bạn đã xem Inception",
  },
  {
    id: "rc-2",
    title: "Bóng Tối Sau Cánh Cửa",
    poster:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=600&fit=crop&auto=format",
    rating: "8.0",
    genre: "Kinh dị",
    year: 2023,
    reason: "Dựa trên thể loại Kinh dị bạn thích",
  },
  {
    id: "rc-3",
    title: "Hành Trình Phương Bắc",
    poster:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop&auto=format",
    rating: "8.3",
    genre: "Phiêu lưu",
    year: 2023,
    reason: "Vì bạn đã xem Interstellar",
  },
  {
    id: "rc-4",
    title: "Trò Chơi Quyền Lực",
    poster:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop&auto=format",
    rating: "9.0",
    genre: "Hình sự",
    year: 2023,
    reason: "Thịnh hành cùng người xem giống bạn",
  },
  {
    id: "rc-5",
    title: "Nhịp Tim Thành Phố",
    poster:
      "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=400&h=600&fit=crop&auto=format",
    rating: "7.8",
    genre: "Âm nhạc",
    year: 2023,
    reason: "Vì bạn đã xem La La Land",
  },
  {
    id: "rc-6",
    title: "Vết Sẹo Của Biển",
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=600&fit=crop&auto=format",
    rating: "8.1",
    genre: "Tâm lý",
    year: 2023,
    reason: "Dựa trên thể loại Tâm lý bạn thích",
  },
  {
    id: "rc-7",
    title: "Đế Chế Sụp Đổ",
    poster:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=400&h=600&fit=crop&auto=format",
    rating: "8.7",
    genre: "Hành động",
    year: 2023,
    reason: "Vì bạn đã xem Gladiator",
  },
  {
    id: "rc-8",
    title: "Ánh Trăng Vỡ",
    poster:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop&auto=format",
    rating: "7.9",
    genre: "Tình cảm",
    year: 2023,
    reason: "Vì bạn đã xem The Notebook",
  },
];

// ---------------------------------------------------------------------------
// Sub-component: RecommendedCard
// ---------------------------------------------------------------------------

interface RecommendedCardProps {
  movie: RecommendedMovie;
}

const RecommendedCard: React.FC<RecommendedCardProps> = ({ movie }) => {
  return (
    <button
      type="button"
      aria-label={`Xem phim ${movie.title}, ${movie.reason}`}
      className="group w-36 shrink-0 snap-start sm:w-44 lg:w-48"
    >
      {/* ── Poster wrapper ── */}
      <div
        className={[
          "relative aspect-2/3 w-full overflow-hidden rounded-2xl",
          "bg-[#1e293b]",
          "transition-all duration-300 ease-out",
          "group-hover:-translate-y-2 group-hover:scale-105",
          "group-hover:shadow-[0_0_20px_rgba(0,163,255,0.4)]",
        ].join(" ")}
      >
        {/* Ảnh phim */}
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />

        {/* Gradient đen phủ 1/3 đáy – fade khi hover */}
        <div
          className={[
            "absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent",
            "transition-opacity duration-300 ease-out",
            "group-hover:opacity-40",
          ].join(" ")}
        />

        {/* Rating pill – góc dưới phải */}
        <span
          className={[
            "absolute bottom-2 right-2",
            "flex items-center gap-0.5 rounded-md",
            "bg-black/50 px-1.5 py-0.5 backdrop-blur-sm",
            "text-[11px] font-semibold text-[#ffc107]",
          ].join(" ")}
        >
          ★ {movie.rating}
        </span>
      </div>

      {/* ── Thông tin dưới thẻ ── */}
      <div className="mt-2.5 px-0.5 text-left">
        <p className="truncate text-sm font-bold text-white leading-tight">
          {movie.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#9ca3af]">
          {movie.genre}&nbsp;·&nbsp;{movie.year}
        </p>

        {/* ── Micro-copy cá nhân hóa ── */}
        <p
          className={[
            "mt-1 line-clamp-1 text-[10.5px] italic leading-snug text-[#6b7785]",
            "transition-colors duration-200 group-hover:text-[#00a3ff]/80",
          ].join(" ")}
        >
          {movie.reason}
        </p>
      </div>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Main component: Recommended
// ---------------------------------------------------------------------------

const Recommended: React.FC = () => {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
      {/* ── Section header ── */}
      <div className="mb-6 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-6 w-0.75 rounded-full bg-[#00a3ff] sm:h-7"
          />
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Có Thể Bạn Sẽ Thích
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
        ── Scroll container ──
        pt-4 pb-6 px-1 : buffer để glow + scale không bị clip
        snap-x snap-mandatory scroll-smooth : khựng đúng tâm thẻ khi vuốt
      */}
      <div
        className={[
          "flex gap-4 overflow-x-auto sm:gap-5",
          "scroll-smooth snap-x snap-mandatory",
          "pt-4 pb-6 px-1",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none",
        ].join(" ")}
      >
        {RECOMMENDED_MOVIES.map((movie) => (
          <RecommendedCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default Recommended;
