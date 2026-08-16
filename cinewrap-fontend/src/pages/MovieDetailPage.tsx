import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Skeleton } from "../components/common/Skeleton";

// Kéo Service API, Kiểu dữ liệu & Helper Formatters
import { movieService } from "../services/movieService";
import type { BackendMovie } from "../services/movieService";
import { getCategoryViName } from "../utils/formatters";
import Poster_Fallback from "../assets/images/Poster_Fallback.jpg";
import Backdrop_Fallback from "../assets/images/Backdrop_Fallback.jpg";

// ---------------------------------------------------------------------------
// Sub-component: Skeleton Loading cho trang Detail
// ---------------------------------------------------------------------------

const MovieDetailSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-[#0d1425] pt-20">
    <div className="relative h-[60vh] w-full bg-[#1e293b]">
      <Skeleton className="h-full w-full opacity-30" />
    </div>
    <div className="mx-auto max-w-[1400px] px-4 sm:px-8 -mt-32 relative z-10 space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Skeleton className="aspect-[2/3] w-48 sm:w-64 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-4 w-full pt-8">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main Component: MovieDetailPage
// ---------------------------------------------------------------------------

export const MovieDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // State quản lý dữ liệu thực tế từ NestJS
  const [movie, setMovie] = useState<BackendMovie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<BackendMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State giao diện
  const [isSaved, setIsSaved] = useState(false);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mùa phim đang chọn (Cho Phim Bộ)
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const fetchMovieData = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);

        // Gọi song song: Lấy chi tiết phim và 6 phim liên quan (Dùng getMovies)
        const [movieData, relatedMoviesData] = await Promise.all([
          movieService.getMovieBySlug(slug),
          movieService.getMovies({
            page: 1,
            limit: 6,
            sortBy: "view_count",
            sortOrder: "desc",
          }),
        ]);

        if (isMounted && movieData) {
          setMovie(movieData);
          setRelatedMovies(relatedMoviesData?.data || []);

          // Nếu có seasons, mặc định chọn season đầu tiên
          if (movieData.seasons && movieData.seasons.length > 0) {
            setSelectedSeasonId(movieData.seasons[0].id);
          } else {
            setSelectedSeasonId(null);
          }
        }
      } catch (error) {
        console.error("Lỗi chi tiết phim:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMovieData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Toast thông báo
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Lưu phim
  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    showToast(
      !isSaved
        ? "Đã thêm phim vào danh sách lưu!"
        : "Đã xóa phim khỏi danh sách lưu!",
    );
  };

  // Chia sẻ URL
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Đã sao chép liên kết phim vào bộ nhớ tạm!");
  };

  // Chuyển sang trang phát video (WatchPage)
  const handleWatchMovie = (episodeNumber?: number) => {
    if (!movie) return;
    if (movie.type === "SINGLE") {
      navigate(`/watch/${movie.slug}`);
    } else {
      navigate(`/watch/${movie.slug}?ep=${episodeNumber || 1}`);
    }
  };

  if (isLoading || !movie) {
    return <MovieDetailSkeleton />;
  }

  // Lấy mùa phim đang chọn nếu là phim bộ
  const currentSeason = movie.seasons?.find((s) => s.id === selectedSeasonId);
  const episodesList =
    movie.type === "SERIES"
      ? currentSeason?.episodes || []
      : movie.episodes || [];

  const posterSrc = movie.poster_url || Poster_Fallback;
  const backdropSrc =
    movie.backdrop_url || movie.poster_url || Backdrop_Fallback;

  return (
    <main className="min-h-screen w-full bg-[#0d1425] font-sans text-cine-text overflow-x-hidden">
      <Header />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 rounded-xl bg-[#00a3ff] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in">
          ✓ {toastMessage}
        </div>
      )}

      {/* ── 1. HERO BACKDROP SECTION ── */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">
        <img
          src={backdropSrc}
          alt={movie.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = Backdrop_Fallback;
          }}
          className="h-full w-full object-cover object-center scale-105 filter brightness-90"
        />
        {/* Gradients Phủ Mờ Cinematics */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1425] via-[#0d1425]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1425] via-[#0d1425]/40 to-transparent hidden md:block" />
      </div>

      {/* ── 2. MAIN CONTENT OVERLAY ── */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 -mt-40 sm:-mt-52 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* Poster Dọc */}
          <div className="shrink-0 w-44 sm:w-60 md:w-72 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#1e293b] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/10">
              <img
                src={posterSrc}
                alt={movie.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = Poster_Fallback;
                }}
                className="h-full w-full object-cover"
              />
              {movie.is_vip && (
                <span className="absolute top-3 left-3 rounded-md bg-[#e50914] px-2 py-0.5 text-[11px] font-extrabold text-white shadow-md">
                  VIP
                </span>
              )}
            </div>
          </div>

          {/* Metadata Phim */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-[#9ca3af]">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="hover:text-white transition cursor-pointer"
              >
                Trang chủ
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => navigate("/movies")}
                className="hover:text-white transition cursor-pointer"
              >
                Thư viện
              </button>
              <span>/</span>
              <span className="text-[#00a3ff] font-semibold truncate max-w-[200px]">
                {movie.title}
              </span>
            </div>

            {/* Tên Phim */}
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {movie.title}
              </h1>
              {movie.original_title && (
                <p className="text-sm sm:text-base text-[#9ca3af] italic mt-1 font-medium">
                  {movie.original_title}
                </p>
              )}
            </div>

            {/* Badges thông tin */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              <span className="flex items-center gap-1 rounded-full bg-[#ffc107]/15 border border-[#ffc107]/30 px-3 py-1 text-xs font-bold text-[#ffc107]">
                ★{" "}
                {movie.average_rating ? movie.average_rating.toFixed(1) : "8.5"}
              </span>
              <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold text-white">
                {movie.release_year || new Date(movie.created_at).getFullYear()}
              </span>
              <span className="rounded-full bg-[#e50914]/15 border border-[#e50914]/30 px-3 py-1 text-xs font-bold text-[#e50914]">
                {movie.age_rating || "16+"}
              </span>
              <span className="rounded-full bg-[#00a3ff]/15 border border-[#00a3ff]/30 px-3 py-1 text-xs font-semibold text-[#00a3ff]">
                {movie.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"}
              </span>
            </div>

            {/* Thẻ Thể loại */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {movie.categories?.map((catRel, idx) => (
                <button
                  key={catRel.categoryId || idx}
                  type="button"
                  onClick={() =>
                    navigate(`/movies?category=${catRel.category?.slug}`)
                  }
                  className="rounded-lg bg-[#1e293b] px-3 py-1 text-xs font-medium text-[#9ca3af] hover:bg-[#00a3ff] hover:text-white transition-all cursor-pointer"
                >
                  {getCategoryViName(catRel)}
                </button>
              ))}
            </div>

            {/* Tóm tắt Nội dung (Synopsis) */}
            <div className="pt-2 text-xs sm:text-sm text-[#9ca3af] leading-relaxed max-w-3xl">
              <p
                className={
                  !isSynopsisExpanded
                    ? "line-clamp-3 md:line-clamp-4"
                    : "line-clamp-none"
                }
              >
                {movie.description ||
                  "Chưa có thông tin tóm tắt cho bộ phim này."}
              </p>
              {movie.description && movie.description.length > 150 && (
                <button
                  type="button"
                  onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                  className="mt-1 text-xs font-bold text-[#00a3ff] hover:underline focus:outline-none cursor-pointer"
                >
                  {isSynopsisExpanded ? "Thu gọn ▲" : "Đọc thêm ▼"}
                </button>
              )}
            </div>

            {/* Lượt xem */}
            <div className="pt-2 text-xs space-y-1 text-[#9ca3af]">
              <p>
                <strong className="text-white">Lượt xem:</strong>{" "}
                {movie.view_count?.toLocaleString("vi-VN") || 0} lượt
              </p>
            </div>

            {/* ── ACTION BUTTONS BAR ── */}
            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Nút Xem Phim Chính */}
              <button
                type="button"
                onClick={() => handleWatchMovie()}
                className="flex items-center gap-2 rounded-xl bg-[#00a3ff] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(0,163,255,0.4)] transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem Phim Ngay
              </button>

              {/* Nút Xem Trailer */}
              {movie.trailer_url && (
                <button
                  type="button"
                  onClick={() => setShowTrailerModal(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 cursor-pointer"
                >
                  🎬 Trailer
                </button>
              )}

              {/* Nút Lưu Phim */}
              <button
                type="button"
                onClick={handleToggleSave}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-bold transition active:scale-95 cursor-pointer ${
                  isSaved
                    ? "border-[#ffc107] bg-[#ffc107]/20 text-[#ffc107]"
                    : "border-white/15 bg-[#1e293b] text-white hover:bg-white/10"
                }`}
              >
                {isSaved ? "★ Đã Lưu" : "+ Lưu Phim"}
              </button>

              {/* Nút Chia Sẻ */}
              <button
                type="button"
                onClick={handleShare}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-[#1e293b] text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
                title="Chia sẻ"
              >
                🔗
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. EPISODE SELECTOR SECTION (DANH SÁCH TẬP PHIM) ── */}
        <div className="mt-16 rounded-2xl bg-[#131c2e]/70 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#00a3ff]" />
              Danh Sách Tập Phim
            </h2>
            <span className="text-xs text-[#9ca3af]">
              {movie.type === "SINGLE"
                ? "1 Tập (Phim Lẻ)"
                : `Tổng ${episodesList.length} tập`}
            </span>
          </div>

          {movie.type === "SINGLE" ? (
            /* Phim Lẻ UI */
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0f172a] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00a3ff]/20 text-[#00a3ff] font-bold">
                  4K
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Bản Chiếu Rạp Quốc Tế - Full Vietsub
                  </h4>
                  <p className="text-xs text-[#9ca3af]">
                    Thời lượng: {movie.duration || 120} phút · Chất lượng Server
                    VIP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleWatchMovie()}
                className="w-full sm:w-auto rounded-xl bg-[#00a3ff] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
              >
                Phát Video
              </button>
            </div>
          ) : (
            /* Phim Bộ UI */
            <div className="space-y-6">
              {/* Season Tabs */}
              {movie.seasons && movie.seasons.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {movie.seasons.map((season) => (
                    <button
                      key={season.id}
                      type="button"
                      onClick={() => setSelectedSeasonId(season.id)}
                      className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                        selectedSeasonId === season.id
                          ? "bg-[#00a3ff] text-white shadow-[0_0_12px_rgba(0,163,255,0.4)]"
                          : "bg-[#0f172a] text-[#9ca3af] hover:text-white"
                      }`}
                    >
                      {season.title || `Mùa ${season.season_number}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Episode Grid */}
              {episodesList.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {episodesList.map((ep) => (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => handleWatchMovie(ep.episode_number)}
                      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f172a] transition-all hover:border-[#00a3ff]/50 hover:bg-[#1e293b] cursor-pointer"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1e293b]">
                        <img
                          src={backdropSrc}
                          alt={ep.title || `Tập ${ep.episode_number}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              Poster_Fallback;
                          }}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition" />
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                          {ep.duration ? `${ep.duration} phút` : "24 phút"}
                        </span>
                      </div>
                      <div className="p-2.5 text-left">
                        <p className="text-xs font-bold text-white group-hover:text-[#00a3ff] transition truncate">
                          {ep.title || `Tập ${ep.episode_number}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9ca3af] italic">
                  Các tập phim của mùa này đang được cập nhật...
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── 4. RELATED MOVIES SECTION ── */}
        {relatedMovies.length > 0 && (
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span className="h-5 w-1.5 rounded-full bg-[#ffc107]" />
                Có Thể Bạn Sẽ Thích
              </h2>
              <button
                type="button"
                onClick={() => navigate("/movies")}
                className="text-xs font-semibold text-[#00a3ff] hover:underline cursor-pointer"
              >
                Xem tất cả →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {relatedMovies.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => navigate(`/movie/${rel.slug}`)}
                  className="group text-left focus-visible:outline-none cursor-pointer"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#1e293b] transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,163,255,0.4)]">
                    <img
                      src={rel.poster_url || Poster_Fallback}
                      alt={rel.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = Poster_Fallback;
                      }}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-semibold text-[#ffc107] backdrop-blur-sm">
                      ★{" "}
                      {rel.average_rating
                        ? rel.average_rating.toFixed(1)
                        : "8.5"}
                    </span>
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="truncate text-xs font-bold text-white group-hover:text-[#00a3ff] transition-colors">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-[#9ca3af]">
                      {getCategoryViName({
                        category: rel.categories?.[0]?.category,
                      })}{" "}
                      ·{" "}
                      {rel.release_year ||
                        new Date(rel.created_at).getFullYear()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. TRAILER MODAL ── */}
      {showTrailerModal && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#0f172a] border border-white/15 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">
                Trailer: {movie.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowTrailerModal(false)}
                className="text-white/70 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                src={movie.trailer_url}
                title={`Trailer ${movie.title}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default MovieDetailPage;
