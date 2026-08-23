import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Skeleton } from "../components/common/Skeleton";

import { movieService } from "../services/movieService";
import type {
  BackendMovie,
  WatchEpisodeDetail,
  EpisodeNavigationItem,
  VideoServerSource,
} from "../services/movieService";

// ---------------------------------------------------------------------------
// Sub-component: Skeleton Loading
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
// Helper: Làm sạch chuỗi URL nếu dính ký tự Markdown hoặc dấu ngoặc
// ---------------------------------------------------------------------------
const cleanVideoUrl = (rawUrl?: string): string => {
  if (!rawUrl) return "";
  let url = rawUrl.trim();
  const match =
    url.match(/\((https?:\/\/[^\s)]+)\)/) ||
    url.match(/(https?:\/\/[^\s[\]]+)/);
  if (match) {
    url = match[1];
  }
  return url.replace(/[[\]()]/g, "");
};

// ---------------------------------------------------------------------------
// Main Component: WatchPage
// ---------------------------------------------------------------------------

export const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState<BackendMovie | null>(null);
  const [currentEpisode, setCurrentEpisode] =
    useState<WatchEpisodeDetail | null>(null);
  const [navigation, setNavigation] = useState<{
    prev: EpisodeNavigationItem | null;
    next: EpisodeNavigationItem | null;
  }>({ prev: null, next: null });

  const currentEpNum = parseInt(searchParams.get("ep") || "1", 10);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hasCountedViewRef = useRef<boolean>(false);

  // Ref lưu mốc thời gian đã ghi gần nhất để tránh spam ghi localStorage
  const lastSavedTimeRef = useRef<number>(0);

  // State lưu số giây đếm ngược (5, 4, 3, 2, 1, 0 hoặc null khi tắt)
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState<
    number | null
  >(null);
  // Ref giữ Timer ID để hủy bất kỳ lúc nào
  const countdownTimerRef = useRef<number | null>(null);

  // Cuộn vào khung phát khi bật Cinema Mode
  useEffect(() => {
    if (isCinemaMode && playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isCinemaMode]);

  // 1. Tải dữ liệu từ Backend
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    hasCountedViewRef.current = false;

    const fetchWatchData = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);

        const [movieData, watchData] = await Promise.all([
          movieService.getMovieBySlug(slug),
          movieService.getWatchEpisodeDetail(slug, currentEpNum),
        ]);

        if (isMounted) {
          setMovie(movieData);
          if (watchData) {
            setCurrentEpisode(watchData.episode);
            setNavigation(watchData.navigation);

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

  const currentSource: VideoServerSource | undefined =
    currentEpisode?.servers.find((s) => s.id === selectedServerId) ||
    currentEpisode?.servers[0];

  // 2. Tải và phát luồng Stream HLS / MP4
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSource?.url) return;

    const streamUrl = cleanVideoUrl(currentSource.url);
    if (!streamUrl) return;

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
        hls.attachMedia(video);
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      }
    } else {
      video.src = streamUrl;
      video.load();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentSource?.url]);

  const handleVideoPlay = () => {
    if (!hasCountedViewRef.current && currentEpisode?.id) {
      hasCountedViewRef.current = true;
      movieService.increaseEpisodeView(currentEpisode.id).catch((err) => {
        console.error("Lỗi tăng view:", err);
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectEpisode = (epNum: number) => {
    // Xóa bộ đếm ngược nếu đang chạy
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setNextEpisodeCountdown(null);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("ep", epNum.toString());
    setSearchParams(newParams);
  };

  // ---------------------------------------------------------------------------
  // Keyboard Shortcuts Handler
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Chặn phím tắt nếu người dùng đang nhập văn bản trong ô input / textarea
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;
      if (isInput) return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        // Play / Pause
        case "Space":
          e.preventDefault(); // Tránh cuộn trang web xuống dưới
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;

        // Tua tới 5 giây
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 5);
          showToast(`Tua tới +5s (${Math.floor(video.currentTime)}s)`);
          break;

        // Tua lùi 5 giây
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          showToast(`Tua lùi -5s (${Math.floor(video.currentTime)}s)`);
          break;

        // Tăng âm lượng 10%
        case "ArrowUp":
          e.preventDefault();
          video.volume = Math.min(1, Number((video.volume + 0.1).toFixed(1)));
          showToast(`Âm lượng: ${Math.round(video.volume * 100)}%`);
          break;

        // Giảm âm lượng 10%
        case "ArrowDown":
          e.preventDefault();
          video.volume = Math.max(0, Number((video.volume - 0.1).toFixed(1)));
          showToast(`Âm lượng: ${Math.round(video.volume * 100)}%`);
          break;

        // Tắt / Bật tiếng
        case "KeyM":
          e.preventDefault();
          video.muted = !video.muted;
          showToast(video.muted ? "Đã tắt âm (Mute)" : "Đã bật âm");
          break;

        // Toàn màn hình
        case "KeyF":
          e.preventDefault();
          if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
          break;

        default:
          break;
      }
    };

    // Đăng ký sự kiện khi trang mở ra
    window.addEventListener("keydown", handleKeyDown);

    // Hủy đăng ký sự kiện khi rời trang (Clean up)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showToast]);

  if (isLoading) {
    return <WatchPageSkeleton />;
  }

  // ---------------------------------------------------------------------------
  // Video Playback Handlers - Xử lí lưu tiến trình xem phim, chuyển tập, tua video, v.v.
  // ---------------------------------------------------------------------------

  // Tự động Seek tới mốc cũ khi video tải xong Metadata, nhưng chỉ tua tiếp nếu mốc lưu > 5s và cách điểm kết thúc tối thiểu 10s
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !slug) return;

    const progressKey = `cw_progress_${slug}_ep_${currentEpNum}`;
    const savedTimeStr = localStorage.getItem(progressKey);

    if (savedTimeStr) {
      const savedTime = parseFloat(savedTimeStr);
      // Chỉ tua tiếp nếu mốc lưu > 5s và cách điểm kết thúc tối thiểu 10s
      if (savedTime > 5 && savedTime < video.duration - 10) {
        video.currentTime = savedTime;
        const minutes = Math.floor(savedTime / 60);
        const seconds = Math.floor(savedTime % 60)
          .toString()
          .padStart(2, "0");
        showToast(`Đang phát tiếp từ ${minutes}:${seconds}`);
      }
    }
  };

  // Lưu currentTime vào localStorage mỗi 5 giây
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !slug) return;

    const now = Math.floor(video.currentTime);
    if (now - lastSavedTimeRef.current >= 5) {
      lastSavedTimeRef.current = now;
      const progressKey = `cw_progress_${slug}_ep_${currentEpNum}`;
      localStorage.setItem(progressKey, now.toString());
    }
  };

  // Xóa tiến trình khi đã xem hết tập phim
  const handleVideoEnded = () => {
    if (slug) {
      localStorage.removeItem(`cw_progress_${slug}_ep_${currentEpNum}`);
    }

    // Nếu có tập kế tiếp, bật bộ đếm ngược 5 giây
    if (navigation.next) {
      const nextEp = navigation.next.episode_number;
      let count = 5;
      setNextEpisodeCountdown(count);

      countdownTimerRef.current = window.setInterval(() => {
        count -= 1;
        if (count <= 0) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          setNextEpisodeCountdown(null);
          handleSelectEpisode(nextEp);
        } else {
          setNextEpisodeCountdown(count);
        }
      }, 1000);
    }
  };

  // Hàm bấm Hủy chuyển tập
  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setNextEpisodeCountdown(null);
  };

  if (!movie || !currentEpisode) {
    return (
      <main className="min-h-screen w-full bg-[#0d1425] font-sans text-white">
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

  const allEpisodes =
    movie.type === "SERIES"
      ? movie.seasons?.flatMap((s) => s.episodes || []) || []
      : movie.episodes || [];

  return (
    <main className="min-h-screen w-full bg-[#0d1425] font-sans text-white overflow-x-hidden">
      {/* Nền đen rạp phim */}
      {isCinemaMode && (
        <div
          className="fixed inset-0 z-40 bg-black/95 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
          onClick={() => setIsCinemaMode(false)}
        />
      )}

      <Header />

      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 rounded-xl bg-[#00a3ff] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in">
          ✓ {toastMessage}
        </div>
      )}

      <div className="pt-24 pb-16 px-4 sm:px-8 max-w-[1600px] mx-auto space-y-6">
        {/* Breadcrumb */}
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
              ? "z-50 ring-2 ring-[#00a3ff]/40 shadow-[0_0_60px_rgba(0,163,255,0.4)]"
              : "z-10"
          }`}
        >
          {currentSource?.url ? (
            <>
              <video
                ref={videoRef}
                controls
                playsInline
                preload="auto"
                onPlay={handleVideoPlay} // Gọi hàm handleVideoPlay khi video bắt đầu phát
                onLoadedMetadata={handleLoadedMetadata} // Gắn hàm khôi phục tiến trình xem khi metadata được tải
                onTimeUpdate={handleTimeUpdate} // Gắn hàm lưu tiến trình xem khi thời gian thay đổi
                onEnded={handleVideoEnded} // Gắn hàm xóa tiến trình khi video kết thúc
                className="w-full h-full object-contain block relative z-10"
              >
                Trình duyệt của bạn không hỗ trợ phát video.
              </video>

              {/*  Overlay đếm ngược tự động chuyển tập */}
              {nextEpisodeCountdown !== null && navigation.next && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in">
                  <p className="text-xs uppercase tracking-widest text-[#9ca3af] mb-1">
                    Chuẩn bị phát tiếp
                  </p>
                  <h3 className="text-lg sm:text-2xl font-black text-white mb-4">
                    {navigation.next.episode_number}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectEpisode(navigation.next!.episode_number)
                      }
                      className="rounded-xl bg-[#00a3ff] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition cursor-pointer"
                    >
                      Phát ngay ({nextEpisodeCountdown}s)
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCountdown}
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[#9ca3af]">
              Tập phim này hiện chưa có nguồn phát video khả dụng.
            </div>
          )}
        </div>

        {/* ── 2. PLAYER ACTION BAR ── */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#131c2e]/90 border border-white/10 p-4 backdrop-blur-xl transition-all ${
            isCinemaMode ? "relative z-50" : "relative z-10"
          }`}
        >
          {/* Next / Prev */}
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

          {/* Server Switcher */}
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

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
                isCinemaMode
                  ? "border-[#ffc107] bg-[#ffc107] text-[#0d1425]"
                  : "border-white/10 bg-[#0f172a] text-white hover:bg-[#1e293b]"
              }`}
            >
              {isCinemaMode ? "☀️ Thoát Rạp Phim" : "🌙 Chế Độ Rạp Phim"}
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

        {/* ── 3. THÔNG TIN VÀ DANH SÁCH TẬP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
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
