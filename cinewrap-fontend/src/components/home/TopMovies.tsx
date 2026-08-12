import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BackendMovie } from "../../services/movieService";
import { getCategoryViName } from "../../utils/formatters";

// ---------------------------------------------------------------------------
// Props Interfaces
// ---------------------------------------------------------------------------

interface TopMoviesProps {
  movies?: BackendMovie[];
}

interface RankingCardProps {
  movie: BackendMovie;
  rank: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Màu sắc số thứ tự: Top 3 nổi bật, còn lại xám mờ */
const getRankStyle = (rank: number): string => {
  if (rank === 1) return "text-[#ffc107]"; // Vàng – hạng 1
  if (rank === 2) return "text-[#9ca3af]"; // Bạc – hạng 2
  if (rank === 3) return "text-[#cd7f32cc]"; // Đồng – hạng 3 (amber mờ)
  return "text-[#334155]"; // Xám surface – hạng 4-10
};

/** Text-stroke CSS inline cho số outline */
const outlineStyle = (rank: number): React.CSSProperties => {
  const color =
    rank === 1
      ? "#ffc107"
      : rank === 2
        ? "#9ca3af"
        : rank === 3
          ? "#cd7f32"
          : "#475569";
  return {
    WebkitTextStroke: `1.5px ${color}`,
    color: "transparent",
  };
};

// ---------------------------------------------------------------------------
// Sub-component: RankingCard
// ---------------------------------------------------------------------------

const RankingCard: React.FC<RankingCardProps> = ({ movie, rank }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const posterUrl =
    movie.poster_url ||
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format";

  return (
    <button
      type="button"
      onClick={() => navigate(`/movie/${movie.slug}`)}
      aria-label={`Hạng ${rank}: ${movie.title}`}
      className="group relative flex w-full items-center focus-visible:outline-none"
    >
      {/*
        ── Số thứ tự khổng lồ ──
        Nằm bên trái, dùng negative margin-right để đè vào cạnh trái poster.
        z-10 để luôn hiện lên trên thẻ.
      */}
      <div
        className={[
          "relative z-10 flex-none select-none",
          "w-10 sm:w-14 lg:w-16", // độ rộng cột số
          "-mr-3 sm:-mr-4", // kéo sang phải đè vào poster
          "text-[3.5rem] sm:text-[5rem] lg:text-[6rem]",
          "font-extrabold leading-none",
          "transition-all duration-300",
          // Khi hover: số sáng lên nhẹ
          rank <= 3 ? getRankStyle(rank) : "",
        ].join(" ")}
        style={outlineStyle(rank)}
        aria-hidden="true"
      >
        {rank}
      </div>

      {/*
        ── Thẻ phim (poster + info) ──
        flex-1 để chiếm hết không gian còn lại.
        overflow-visible ở wrapper ngoài để số thứ tự tràn ra không bị clip.
      */}
      <div
        className={[
          "relative flex flex-1 items-center gap-3 sm:gap-4",
          "rounded-xl bg-[#1e293b] p-2.5 sm:p-3",
          "transition-all duration-300 ease-out",
          // Hover: nhấc nhẹ + viền sáng cyan
          "group-hover:-translate-y-0.5",
          "group-hover:shadow-[0_4px_24px_rgba(0,163,255,0.18)]",
          "group-hover:ring-1 group-hover:ring-[#00a3ff]/30",
        ].join(" ")}
      >
        {/* ── Poster nhỏ dọc 2:3 ── */}
        <div className="relative aspect-2/3 h-20 flex-none overflow-hidden rounded-lg sm:h-24 lg:h-28">
          {!imgError ? (
            <img
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#334155] text-[#475569] text-xs">
              N/A
            </div>
          )}

          {/* Shimmer overlay khi hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* ── Thông tin phim ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
          {/* Tiêu đề */}
          <p className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
            {movie.title}
          </p>

          {/* Genre · Year */}
          <p className="text-xs text-[#9ca3af]">
            {getCategoryViName(movie.categories?.[0])}&nbsp;·&nbsp;
            {movie.release_year || new Date(movie.created_at).getFullYear()}
          </p>

          {/* Rating + Duration */}
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-xs font-semibold text-[#ffc107]">
              <svg
                className="h-3 w-3 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {movie.average_rating ? movie.average_rating.toFixed(1) : "8.5"}
            </span>

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
                  d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
              {movie.duration ? `${movie.duration}m` : "120m"}
            </span>

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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {movie.view_count || 0}
            </span>
          </div>
        </div>

        {/* ── Nút Play mini (hiện khi hover) ── */}
        <div className="flex-none opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 pr-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffc107] shadow-lg sm:h-10 sm:w-10">
            <svg
              className="ml-0.5 h-4 w-4 fill-[#0f172a]"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M6.3 2.84A1 1 0 005 3.7v12.6a1 1 0 001.3.86l11-6.3a1 1 0 000-1.72l-11-6.3z" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Main component: TopMovies
// ---------------------------------------------------------------------------

export const TopMovies: React.FC<TopMoviesProps> = ({ movies = [] }) => {
  const navigate = useNavigate();

  // Chia danh sách phim thành 2 cột (5 phim mỗi cột)
  const leftCol = movies.slice(0, 5);
  const rightCol = movies.slice(5, 10);

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
      {/* ── Section header ── */}
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-6 w-0.75 rounded-full bg-[#ffc107] sm:h-7"
          />
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Bảng Xếp Hạng
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigate("/movies")}
          className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 text-xs font-semibold text-[#00a3ff] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] sm:text-sm"
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
        ── Layout ──
        Mobile  : 1 cột, hiển thị Top 5 (ẩn cột phải)
        Tablet+ : 2 cột, hiển thị Top 10
      */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-3">
        {/* Cột trái – hạng 1-5 */}
        <div className="flex flex-col gap-3">
          {leftCol.map((movie, idx) => (
            <RankingCard key={movie.id} movie={movie} rank={idx + 1} />
          ))}
        </div>

        {/* Cột phải – hạng 6-10 (ẩn trên mobile) */}
        <div className="hidden flex-col gap-3 lg:flex">
          {rightCol.map((movie, idx) => (
            <RankingCard key={movie.id} movie={movie} rank={idx + 6} />
          ))}
        </div>

        {/* Nút "Xem thêm" hiển thị trên mobile thay cho cột phải */}
        <button
          type="button"
          className={[
            "lg:hidden mt-1 w-full rounded-xl py-3",
            "border border-[#334155] bg-[#1e293b]",
            "text-sm font-semibold text-[#00a3ff]",
            "transition-colors duration-200 hover:border-[#00a3ff]/40 hover:bg-[#00a3ff]/10",
          ].join(" ")}
        >
          Xem thêm Top 6–10 →
        </button>
      </div>
    </section>
  );
};
