import React, { useState } from "react";

interface HeroMovie {
  id: string;
  title: string;
  backdrop: string;
  rating: string;
  genre: string;
  quality: string;
  ageRating: string;
  synopsis: string;
}

const HERO_MOVIES: HeroMovie[] = [
  {
    id: "hm-1",
    title: "Vực Thẳm Vô Tận",
    backdrop:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop",
    rating: "8.5",
    genre: "Hành động",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Một đặc vụ phải đối mặt với quá khứ của chính mình khi một âm mưu toàn cầu đe dọa lật đổ trật tự thế giới.",
  },
  {
    id: "hm-2",
    title: "Ánh Sáng Cuối Đường Hầm",
    backdrop:
      "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop",
    rating: "9.1",
    genre: "Tâm lý",
    quality: "HD 4K",
    ageRating: "16+",
    synopsis:
      "Câu chuyện cảm động về hành trình tìm lại chính mình sau biến cố lớn nhất cuộc đời.",
  },
  {
    id: "hm-3",
    title: "Thiên Hà Tan Vỡ",
    backdrop:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=1920&auto=format&fit=crop",
    rating: "8.8",
    genre: "Viễn tưởng",
    quality: "HD 4K",
    ageRating: "13+",
    synopsis:
      "Phi hành đoàn cuối cùng của Trái Đất phải tìm ra ngôi nhà mới trước khi quá muộn.",
  },
];

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-semibold text-cine-text backdrop-blur-sm sm:text-sm">
    {children}
  </span>
);

const HeroBanner: React.FC = () => {
  const [active, setActive] = useState(0);
  const movie = HERO_MOVIES[active];

  const goTo = (direction: "prev" | "next") => {
    setActive((prev) => {
      if (direction === "next") return (prev + 1) % HERO_MOVIES.length;
      return (prev - 1 + HERO_MOVIES.length) % HERO_MOVIES.length;
    });
  };

  return (
    <section className="relative flex min-h-[80vh] w-full items-end overflow-hidden sm:min-h-[85vh] lg:min-h-[90vh]">
      {/* Background image (giả lập trailer auto-play) */}
      <div className="absolute inset-0">
        <img
          key={movie.id}
          src={movie.backdrop}
          alt={movie.title}
          className="h-full w-full animate-[heroZoom_12s_ease-in-out_infinite_alternate] object-cover"
        />
        {/* Gradient phủ từ dưới lên */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg-primary via-cine-bg-primary/60 to-transparent" />
        {/* Gradient phủ từ trái sang */}
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg-primary/90 via-cine-bg-primary/20 to-transparent" />
      </div>

      {/* Nút điều hướng slide - ẩn trên mobile */}
      <button
        type="button"
        aria-label="Phim trước"
        onClick={() => goTo("prev")}
        className="group absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 sm:flex"
      >
        <svg
          className="h-5 w-5 text-cine-text transition group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Phim tiếp theo"
        onClick={() => goTo("next")}
        className="group absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 sm:flex"
      >
        <svg
          className="h-5 w-5 text-cine-text transition group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Nội dung */}
      <div className="relative z-10 w-full px-4 pb-10 sm:px-8 sm:pb-14 lg:px-16 lg:pb-20">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
            <Badge>{movie.ageRating}</Badge>
            <Badge>{movie.quality}</Badge>
            <Badge>{movie.genre}</Badge>
            <Badge>⭐ {movie.rating}</Badge>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-cine-text drop-shadow-lg sm:text-5xl lg:text-6xl">
            {movie.title}
          </h1>

          <p className="mt-3 line-clamp-2 max-w-xl text-sm text-cine-text-muted sm:mt-4 sm:text-base lg:text-lg">
            {movie.synopsis}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-cine-primary px-5 py-2.5 text-sm font-bold text-cine-bg-primary transition hover:brightness-110 active:scale-95 sm:px-6 sm:py-3 sm:text-base"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.84A1 1 0 0 0 5 3.7v12.6a1 1 0 0 0 1.3.86l11-6.3a1 1 0 0 0 0-1.72l-11-6.3z" />
              </svg>
              Xem ngay
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-cine-text backdrop-blur-md transition hover:bg-white/20 active:scale-95 sm:px-6 sm:py-3 sm:text-base"
            >
              Chi tiết
            </button>
          </div>

          {/* Chỉ báo slide */}
          <div className="mt-6 flex gap-2 sm:mt-8">
            {HERO_MOVIES.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                aria-label={`Chuyển đến phim ${idx + 1}`}
                onClick={() => setActive(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === active
                    ? "w-8 bg-cine-primary"
                    : "w-3 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
