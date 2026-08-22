import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Skeleton } from "../components/common/Skeleton";

// Kéo Service API và Kiểu dữ liệu thật
import { movieService } from "../services/movieService";
import type {
  BackendMovie,
  WatchEpisodeDetail,
  EpisodeNavigationItem,
  VideoServerSource,
} from "../services/movieService";

// ---------------------------------------------------------------------------
// Sub-component: Skeleton Loading cho WatchPage
// ---------------------------------------------------------------------------

const WatchPageSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-[#0d1425] pt-24 px-4 sm:px-8 max-w-[1600px] mx-auto space-y-6">
    <Skeleton className="aspect-video w-full rounded-2xl" />
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main Component: WatchPage
// ---------------------------------------------------------------------------

export const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Trạng thái dữ liệu từ API
  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState<BackendMovie | null>(null);
  const [currentEpisode, setCurrentEpisode] =
    useState<WatchEpisodeDetail | null>(null);
  const [navigation, setNavigation] = useState<{
    prev: EpisodeNavigationItem | null;
    next: EpisodeNavigationItem | null;
  }>({ prev: null, next: null });

  // Trạng thái Player
  const currentEpNum = parseInt(searchParams.get("ep") || "1", 10);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs quản lý Video & HLS
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hasCountedViewRef = useRef<boolean>(false);

  // Tự động cuộn góc nhìn vào giữa Player khi Bật/Tắt Rạp phim
  useEffect(() => {
    if (isCinemaMode && playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isCinemaMode]);

  // 1. Tải dữ liệu bộ phim và chi tiết tập phim từ NestJS
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    hasCountedViewRef.current = false; // Reset cờ đếm view khi đổi tập

    const fetchWatchData = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);

        // Gọi song song: Lấy thông tin phim và chi tiết tập đang phát
        const [movieData, watchData] = await Promise.all([
          movieService.getMovieBySlug(slug),
          movieService.getWatchEpisodeDetail(slug, currentEpNum),
        ]);

        if (isMounted) {
          setMovie(movieData);
          if (watchData) {
            setCurrentEpisode(watchData.episode);
            setNavigation(watchData.navigation);

            // Mặc định chọn server đầu tiên nếu có
            if (
              watchData.episode.servers &&
              watchData.episode.servers.length > 0
            ) {
              setSelectedServerId(watchData.episode.servers[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin phát phim:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWatchData();

    return () => {
      isMounted = false;
    };
  }, [slug, currentEpNum]);

  // Server video đang chọn
  const currentSource: VideoServerSource | undefined =
    currentEpisode?.servers.find((s) => s.id === selectedServerId) ||
    currentEpisode?.servers[0];

  // 2. Khởi tạo và giải mã luồng Stream HLS (.m3u8)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !currentSource?.url) return;

    const streamUrl = currentSource.url;

    // Hủy phiên bản HLS cũ trước khi nạp nguồn mới
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (streamUrl.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        hlsRef.current = hls;
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        // Hỗ trợ trực tiếp cho trình duyệt Safari
        videoElement.src = streamUrl;
      }
    } else {
      // Nguồn video MP4 thông thường
      videoElement.src = streamUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentSource]);

  // 3. Gửi yêu cầu tăng view khi người dùng bấm Play video
  const handleVideoPlay = () => {
    if (!hasCountedViewRef.current && currentEpisode?.id) {
      hasCountedViewRef.current = true;
      movieService.increaseEpisodeView(currentEpisode.id).catch((err) => {
        console.error("Lỗi tăng view:", err);
      });
    }
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Đổi tập phim qua URL Query Param
  const handleSelectEpisode = (epNum: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("ep", epNum.toString());
    setSearchParams(newParams);
  };

  if (isLoading) {
    return <WatchPageSkeleton />;
  }

  // Giao diện xử lý khi không tìm thấy phim hoặc tập phim
  if (!movie || !currentEpisode) {
    return (
      <main className="min-h-screen w-full bg-[#0d1425] font-sans text-cine-text">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1e293b] text-4xl mb-4 border border-white/10">
            🎬
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Không tìm thấy nguồn phát
          </h2>
          <p className="text-sm text-[#9ca3af] max-w-md mb-6">
            Tập phim này hiện chưa có video hoặc đường dẫn không khả dụng.
          </p>
          <button
            type="button"
            onClick={() => navigate("/movies")}
            className="rounded-xl bg-[#00a3ff] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110 cursor-pointer"
          >
            Quay lại Thư viện phim
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  // Danh sách toàn bộ các tập phim của bộ phim
  const allEpisodes =
    movie.type === "SERIES"
      ? movie.seasons?.flatMap((s) => s.episodes || []) || []
      : movie.episodes || [];

  return (
    <main className="min-h-screen w-full bg-[#0d1425] font-sans text-cine-text overflow-x-hidden">
      {/* Phông nền đen bao phủ khi bật Chế độ Rạp Phim */}
      {isCinemaMode && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 transition-opacity duration-500 cursor-pointer backdrop-blur-md"
          onClick={() => setIsCinemaMode(false)}
          title="Bấm để tắt chế độ rạp phim"
        />
      )}

      <Header />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 rounded-xl bg-[#00a3ff] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in">
          ✓ {toastMessage}
        </div>
      )}

      <div className="pt-24 pb-16 px-4 sm:px-8 max-w-[1600px] mx-auto space-y-6">
        {/* ── Breadcrumb & Title ── */}
        <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
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
            onClick={() => navigate(`/movie/${movie.slug}`)}
            className="hover:text-white transition cursor-pointer"
          >
            {movie.title}
          </button>
          <span>/</span>
          <span className="text-[#00a3ff] font-semibold">
            {movie.type === "SINGLE"
              ? "Phim Lẻ"
              : currentEpisode.title || `Tập ${currentEpisode.episode_number}`}
          </span>
        </div>

        {/* ── 1. MAIN VIDEO PLAYER CONTAINER ── */}
        <div
          ref={playerContainerRef}
          className={`relative w-full aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${
            isCinemaMode
              ? "relative z-[90] shadow-[0_0_60px_rgba(0,163,255,0.4)] ring-2 ring-[#00a3ff]/40"
              : "z-10"
          }`}
        >
          {currentSource?.url ? (
            <video
              ref={videoRef}
              controls
              autoPlay
              muted //Thêm thuộc tính này để vượt qua chính sách Autoplay của trình duyệt
              playsInline
              onPlay={handleVideoPlay}
              className="h-full w-full object-contain"
            >
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[#9ca3af]">
              Tập phim này hiện chưa có nguồn phát video khả dụng.
            </div>
          )}
        </div>

        {/* ── 2. PLAYER ACTION BAR (Chuyển tập, Đổi Server, Rạp phim) ── */}
        <div className="relative z-[90] flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#131c2e]/80 border border-white/10 p-4 backdrop-blur-xl">
          {/* Cụm điều hướng Tập trước / Tập sau */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!navigation.prev}
              onClick={() =>
                navigation.prev &&
                handleSelectEpisode(navigation.prev.episode_number)
              }
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#1e293b] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              ‹ Tập trước
            </button>
            <button
              type="button"
              disabled={!navigation.next}
              onClick={() =>
                navigation.next &&
                handleSelectEpisode(navigation.next.episode_number)
              }
              className="flex items-center gap-1 rounded-xl bg-[#00a3ff] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Tập tiếp ›
            </button>
          </div>

          {/* Cụm đổi Server nguồn phát */}
          {currentEpisode.servers && currentEpisode.servers.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-[#9ca3af] font-medium shrink-0">
                Server:
              </span>
              {currentEpisode.servers.map((src) => (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setSelectedServerId(src.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedServerId === src.id
                      ? "bg-[#00a3ff] text-white shadow-[0_0_12px_rgba(0,163,255,0.4)]"
                      : "bg-[#0f172a] text-[#9ca3af] hover:text-white"
                  }`}
                >
                  {src.server_name} ({src.quality || "HD"})
                </button>
              ))}
            </div>
          )}

          {/* Cụm tính năng Rạp phim & Báo lỗi */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-extrabold transition active:scale-95 cursor-pointer ${
                isCinemaMode
                  ? "border-[#ffc107] bg-[#ffc107] text-[#0d1425] shadow-[0_0_20px_rgba(255,193,7,0.5)] animate-pulse"
                  : "border-white/10 bg-[#0f172a] text-white hover:border-[#00a3ff]/50 hover:bg-[#1e293b]"
              }`}
            >
              {isCinemaMode ? (
                <>
                  <span>☀️</span>
                  <span>Thoát Rạp Phim</span>
                </>
              ) : (
                <>
                  <span>🌙</span>
                  <span>Chế Độ Rạp Phim</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => showToast("Đã ghi nhận báo lỗi tập phim!")}
              className="rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
            >
              🚩 Báo Lỗi
            </button>
          </div>
        </div>

        {/* ── 3. THÔNG TIN PHIM VÀ DANH SÁCH TẬP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Cột Trái: Thông tin phim & tập đang xem */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {movie.title} -{" "}
                {movie.type === "SINGLE"
                  ? "Phim Lẻ"
                  : currentEpisode.title ||
                    `Tập ${currentEpisode.episode_number}`}
              </h1>
              <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                <span>
                  👁 {movie.view_count?.toLocaleString("vi-VN") || 0} lượt xem
                </span>
                <span>•</span>
                <span>
                  Năm{" "}
                  {movie.release_year ||
                    new Date(movie.created_at).getFullYear()}
                </span>
                <span>•</span>
                <span className="text-[#ffc107]">
                  ★{" "}
                  {movie.average_rating
                    ? movie.average_rating.toFixed(1)
                    : "8.5"}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
              {movie.description || "Chưa có mô tả cho bộ phim này."}
            </p>
          </div>

          {/* Cột Phải: Danh sách các tập phim */}
          <div className="rounded-2xl bg-[#131c2e]/70 border border-white/10 p-5 backdrop-blur-xl h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
              <span>Danh Sách Tập Phim</span>
              <span className="text-xs text-[#00a3ff] font-semibold">
                {movie.type === "SINGLE"
                  ? "1/1"
                  : `Tập ${currentEpisode.episode_number} / ${allEpisodes.length}`}
              </span>
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {allEpisodes.map((ep) => {
                const isActive =
                  ep.episode_number === currentEpisode.episode_number;
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => handleSelectEpisode(ep.episode_number)}
                    className={`rounded-xl py-2.5 px-2 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      isActive
                        ? "bg-[#00a3ff] text-white shadow-[0_0_12px_rgba(0,163,255,0.4)]"
                        : "bg-[#0f172a] text-[#9ca3af] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isActive && <span>▶</span>}
                    <span>Tập {ep.episode_number}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default WatchPage;
