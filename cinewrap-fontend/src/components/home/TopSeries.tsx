import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BackendMovie } from "../../services/movieService";
import { getCategoryViName } from "../../utils/formatters";

//Hình ảnh Fallback khi không có backdrop/poster
import Poster_Fallback from "../../assets/images/Poster_Fallback.jpg";

// ---------------------------------------------------------------------------
// Props Interfaces
// ---------------------------------------------------------------------------

interface TopSeriesProps {
  movies?: BackendMovie[];
}

interface SeriesCardProps {
  series: BackendMovie;
}

// ---------------------------------------------------------------------------
// Sub-component: SeriesCard (Wide Card)
// ---------------------------------------------------------------------------

const SeriesCard: React.FC<SeriesCardProps> = ({ series }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  // Fallback cho poster và backdrop
  const posterUrl = series.poster_url || Poster_Fallback;

  const backdropUrl =
    series.backdrop_url ||
    series.poster_url ||
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop&auto=format";

  // Cấu hình Badge linh hoạt dựa theo thông tin phim
  const renderBadge = () => {
    if (series.is_vip) {
      return (
        <span className="absolute -top-1.5 -left-1.5 rounded-md bg-[#ffc107] text-[#0f172a] px-2 py-0.5 text-[10px] font-extrabold tracking-wide shadow-md">
          VIP
        </span>
      );
    }
    return (
      <span className="absolute -top-1.5 -left-1.5 rounded-md bg-[#00a3ff] text-white px-2 py-0.5 text-[10px] font-extrabold tracking-wide shadow-md">
        Phim Bộ
      </span>
    );
  };

  return (
    <button
      type="button"
      onClick={() => navigate(`/movie/${series.slug}`)}
      aria-label={`Xem series ${series.title}`}
      className="group relative w-full overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] cursor-pointer"
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
      {/* ── Nền backdrop mờ (chỉ hiện trên sm+) ── */}
      <div className="absolute inset-0 hidden sm:block">
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b] via-[#1e293b]/95 to-[#1e293b]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/80 to-transparent" />
      </div>

      {/* Card nền solid trên mobile */}
      <div className="absolute inset-0 bg-[#1e293b] sm:hidden" />

      {/* ── Layout chính: poster trái + info phải ── */}
      <div className="relative z-10 flex items-stretch gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Poster nhỏ bên trái */}
        <div className="relative flex-none">
          <div className="aspect-[2/3] h-28 overflow-hidden rounded-xl sm:h-32 lg:h-36">
            <img
              src={posterUrl}
              alt={series.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
          {renderBadge()}
        </div>

        {/* Thông tin bên phải */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
          <h3 className="line-clamp-1 text-sm font-bold leading-snug text-white group-hover:text-[#00a3ff] transition-colors sm:text-base lg:text-lg">
            {series.title}
          </h3>

          <p className="text-xs text-[#9ca3af]">
            {getCategoryViName(series.categories?.[0])}&nbsp;·&nbsp;
            {series.release_year || new Date(series.created_at).getFullYear()}
          </p>

          <p className="hidden line-clamp-2 text-xs leading-relaxed text-[#9ca3af] sm:block lg:text-sm">
            {series.description || "Chưa có tóm tắt nội dung cho bộ phim này."}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            <span className="flex items-center gap-1 text-xs font-semibold text-[#ffc107]">
              <svg
                className="h-3 w-3 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {series.average_rating ? series.average_rating.toFixed(1) : "8.5"}
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
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              {series.seasons?.length
                ? `${series.seasons.length} Phần`
                : "Nhiều tập"}
            </span>
          </div>
        </div>

        {/* Nút Play (hiện khi hover trên desktop) */}
        <div
          className="hidden lg:flex flex-none items-center pr-1 transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
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

export const TopSeries: React.FC<TopSeriesProps> = ({ movies = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
      {/* ── Section header ── */}
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div className="flex items-center gap-3">
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
          onClick={() => navigate("/movies?type=SERIES")}
          className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 text-xs font-semibold text-[#00a3ff] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] sm:text-sm cursor-pointer"
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

      {/* ── Danh sách Wide Card ── */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          {movies.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#9ca3af] italic">
          Đang cập nhật danh sách phim bộ...
        </p>
      )}
    </section>
  );
};
