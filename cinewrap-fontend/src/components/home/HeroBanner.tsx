import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { BackendMovie } from "../../services/movieService";
import { getCategoryViName } from "../../utils/formatters";

interface HeroBannerProps {
  movies?: BackendMovie[];
}

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-semibold text-cine-text backdrop-blur-sm sm:text-sm">
    {children}
  </span>
);

export const HeroBanner: React.FC<HeroBannerProps> = ({ movies = [] }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // Lấy bộ phim đang được chọn ở slide
  const movie = movies[active] || movies[0];

  // Helper lấy ảnh backdrop/poster fallback an toàn
  const backdropUrl =
    movie.backdrop_url ||
    movie.poster_url ||
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop";

  const posterUrl =
    movie.poster_url ||
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop";

  // Xử lý chuyển slide
  const goTo = (direction: "prev" | "next") => {
    setActive((prev) => {
      if (direction === "next") return (prev + 1) % movies.length;
      return (prev - 1 + movies.length) % movies.length;
    });
  };

  // Cuộn mượt poster vào giữa khi active đổi
  useEffect(() => {
    const activePoster = document.getElementById(`poster-${active}`);
    if (activePoster) {
      activePoster.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  // Guard clause: Nếu mảng phim rỗng (API chưa về hoặc chưa có data), trả về null
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="relative flex flex-col min-h-[calc(100vh-80px)] w-full overflow-hidden bg-cine-bg-primary pt-20">
      {/* Background image (giả lập trailer auto-play) */}
      <div className="absolute inset-0">
        <img
          key={movie.id}
          src={backdropUrl}
          alt={movie.title}
          className="h-full w-full animate-[heroZoom_12s_ease-in-out_infinite_alternate] object-cover"
        />
        {/* Lớp phủ đen Gradient để Text nổi bật */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg-primary via-cine-bg-primary/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg-primary/90 via-cine-bg-primary/30 to-transparent" />
      </div>

      {/* Nút điều hướng Slide bằng Mũi Tên - Ẩn trên Mobile */}
      {movies.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Phim trước"
            onClick={() => goTo("prev")}
            className="group absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 md:flex cursor-pointer"
          >
            <svg
              className="h-6 w-6 text-cine-text transition group-hover:-translate-x-0.5"
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
            className="group absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 md:flex cursor-pointer"
          >
            <svg
              className="h-6 w-6 text-cine-text transition group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* ─── PHẦN THÔNG TIN PHIM (Nằm trên dải Poster) ─── */}
      <div className="relative z-20 w-full px-4 sm:px-8 lg:px-20 flex-1 flex flex-col justify-center items-start pt-8 pb-4">
        <div className="max-w-3xl">
          {/* Badge Thông Tin */}
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
            <Badge>{movie.age_rating || "16+"}</Badge>
            <Badge>{movie.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"}</Badge>
            <Badge>{getCategoryViName(movie.categories?.[0])}</Badge>
            <Badge>
              ⭐{" "}
              {movie.average_rating ? movie.average_rating.toFixed(1) : "8.5"}
            </Badge>
          </div>

          {/* Tiêu đề & Tóm tắt */}
          <h1 className="text-4xl font-extrabold leading-tight text-cine-text drop-shadow-lg sm:text-5xl lg:text-7xl">
            {movie.title}
          </h1>
          <p className="mt-3 line-clamp-2 sm:line-clamp-3 max-w-2xl text-sm text-cine-text-muted sm:mt-4 sm:text-base lg:text-lg drop-shadow-md">
            {movie.description || "Chưa có tóm tắt nội dung cho bộ phim này."}
          </p>

          {/* Các nút hành động */}
          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <button
              type="button"
              onClick={() => navigate(`/movie/${movie.slug}`)}
              className="flex items-center gap-2 rounded-lg bg-cine-primary px-6 py-2.5 text-sm font-bold text-cine-bg-primary transition hover:brightness-110 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base shadow-[0_0_15px_rgba(255,193,7,0.3)] cursor-pointer"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.84A1 1 0 0 0 5 3.7v12.6a1 1 0 0 0 1.3.86l11-6.3a1 1 0 0 0 0-1.72l-11-6.3z" />
              </svg>
              Xem ngay
            </button>
            <button
              type="button"
              onClick={() => navigate(`/movie/${movie.slug}`)}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-cine-text backdrop-blur-md transition hover:bg-white/20 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base cursor-pointer"
            >
              Chi tiết
            </button>
          </div>

          {/* Chỉ báo Glassmorphism Viên thuốc */}
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-3.5 py-2.5 shadow-lg">
            {movies.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                aria-label={`Chuyển đến phim ${idx + 1}`}
                onClick={() => setActive(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === active
                    ? "w-8 bg-cine-text shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── DẢI POSTER NẰM NGANG PHÍA DƯỚI CÙNG ─── */}
      <div className="relative z-20 w-full mt-auto pb-6 lg:pb-10">
        <div className="flex w-full items-end gap-3 pt-8 lg:gap-4 overflow-x-auto px-4 sm:px-8 lg:px-20 pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {movies.map((m, idx) => (
            <div
              key={m.id}
              id={`poster-${idx}`} // ID để scrollIntoView
              onClick={() => setActive(idx)}
              className={`relative snap-center shrink-0 overflow-hidden rounded-xl cursor-pointer transition-all duration-500 ease-out origin-bottom ${
                active === idx
                  ? "w-28 sm:w-32 lg:w-40 aspect-[2/3] border-2 border-blue-50 shadow-[0_0_25px_rgba(0,0,7,0.4)] opacity-100 scale-105 -translate-y-2 z-10"
                  : "w-24 sm:w-28 lg:w-32 aspect-[2/3] border border-white/15 opacity-40 hover:opacity-80 scale-95"
              }`}
            >
              <img
                src={m.poster_url || posterUrl}
                alt={`Poster ${m.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Lớp phủ đen làm chìm các poster không active */}
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                  active === idx ? "opacity-0" : "opacity-40"
                }`}
              />
            </div>
          ))}
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
