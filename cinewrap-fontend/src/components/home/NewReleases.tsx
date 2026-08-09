import React from "react";
import type { BackendMovie } from "../../services/movieService";
import { getCategoryViName } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Props Interface
// ---------------------------------------------------------------------------

interface NewReleasesProps {
  movies?: BackendMovie[];
}

// ---------------------------------------------------------------------------
// Sub-component: MovieCard
// ---------------------------------------------------------------------------

interface MovieCardProps {
  movie: BackendMovie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  // Helper lấy poster fallback nếu dữ liệu null
  const posterUrl =
    movie.poster_url ||
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format&q=80";

  return (
    <button
      type="button"
      onClick={() => navigate(`/movie/${movie.slug}`)}
      aria-label={`Xem phim ${movie.title}`}
      className="group w-36 shrink-0 snap-start sm:w-44 lg:w-48 text-left cursor-pointer"
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
          src={posterUrl}
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

        {/* Badge VIP / HOT */}
        {movie.is_vip && (
          <span
            aria-label="Phim VIP"
            className={[
              "absolute left-2 top-2",
              "rounded-md bg-[#ffc107] px-1.5 py-0.5",
              "text-[10px] font-extrabold tracking-widest text-[#0d1425]",
              "shadow-lg",
            ].join(" ")}
          >
            VIP
          </span>
        )}

        {/* Rating pill – góc dưới phải */}
        <span
          className={[
            "absolute bottom-2 right-2",
            "flex items-center gap-0.5 rounded-md",
            "bg-black/50 px-1.5 py-0.5 backdrop-blur-sm",
            "text-[11px] font-semibold text-[#ffc107]",
          ].join(" ")}
        >
          ★ {movie.average_rating ? movie.average_rating.toFixed(1) : "8.5"}
        </span>
      </div>

      {/* ── Thông tin dưới thẻ ── */}
      <div className="mt-2.5 px-0.5 text-left">
        <p className="truncate text-sm font-bold text-white leading-tight group-hover:text-[#00a3ff] transition-colors">
          {movie.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#9ca3af]">
          {getCategoryViName(movie.categories?.[0])}&nbsp;·&nbsp;
          {movie.release_year || new Date(movie.created_at).getFullYear()}
        </p>
      </div>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Main component: NewReleases
// ---------------------------------------------------------------------------

export const NewReleases: React.FC<NewReleasesProps> = ({ movies = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
      {/* ── Section header ── */}
      <div className="mb-6 flex items-end justify-between">
        {/* Tiêu đề có vệt line đứng cyan */}
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-6 w-0.75 rounded-full bg-[#00a3ff] sm:h-7"
          />
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Phim Mới Cập Nhật
          </h2>
        </div>

        {/* Nút xem tất cả */}
        <button
          type="button"
          onClick={() => navigate("/movies")}
          className={[
            "group inline-flex h-9 items-center justify-center gap-1.5 rounded-full cursor-pointer",
            "border border-white/10 bg-white/5 px-3.5 text-xs font-semibold text-[#00a3ff] sm:text-sm",
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

      {/* ── Scroll container ── */}
      <div
        className={[
          "flex gap-4 overflow-x-auto sm:gap-5",
          "scroll-smooth snap-x snap-mandatory",
          "pt-4 pb-6 px-1",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none",
        ].join(" ")}
      >
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="text-xs text-[#9ca3af] italic">
            Đang cập nhật danh sách phim mới...
          </p>
        )}
      </div>
    </section>
  );
};
