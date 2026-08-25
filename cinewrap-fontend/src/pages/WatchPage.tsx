import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Skeleton } from "../components/common/Skeleton";

import { RatingModal } from "../components/watch/RatingModal";
import { ReportModal } from "../components/watch/ReportModal";
import type { ReportPayload } from "../components/watch/ReportModal";

import { movieService } from "../services/movieService";
import type {
  BackendMovie,
  WatchEpisodeDetail,
  EpisodeNavigationItem,
  VideoServerSource,
} from "../services/movieService";

// Interface cấu trúc bình luận theo tập
interface EpisodeComment {
  id: string;
  userName: string;
  avatar: string;
  content: string;
  isSpoiler: boolean;
  timestampSeconds?: number;
  createdAt: string;
}

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

  // ── 1. KHAI BÁO CÁC STATE QUẢN LÝ DỮ LIỆU & GIAO DIỆN ──
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

  // State đếm ngược chuyển tập tự động (5, 4, 3, 2, 1, null)
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState<
    number | null
  >(null);

  // ── 2. KHAI BÁO CÁC REFS ĐIỀU KHIỂN VIDEO & BỘ ĐẾM ──
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hasCountedViewRef = useRef<boolean>(false);
  const lastSavedTimeRef = useRef<number>(0);
  const countdownTimerRef = useRef<number | null>(null);

  // Nguồn phát video hiện tại
  const currentSource: VideoServerSource | undefined =
    currentEpisode?.servers.find((s) => s.id === selectedServerId) ||
    currentEpisode?.servers[0];

  // State Yêu thích & Đánh giá sao
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // State Modal Báo lỗi tập phim
  const [showReportModal, setShowReportModal] = useState(false);

  // State Phân hệ bình luận
  const [comments, setComments] = useState<EpisodeComment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [isCommentSpoiler, setIsCommentSpoiler] = useState<boolean>(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<
    Record<string, boolean>
  >({});

  // ── 3. KHAI BÁO CÁC HÀM XỬ LÝ (HANDLERS) ──

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Hàm đổi tập phim qua query param (?ep=...)
  const handleSelectEpisode = useCallback(
    (epNum: number) => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setNextEpisodeCountdown(null);

      const newParams = new URLSearchParams(searchParams);
      newParams.set("ep", epNum.toString());
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  // Fallback Video Server thông minh khi server hiện tại lỗi
  const triggerServerFallback = useCallback(() => {
    if (!currentEpisode?.servers || currentEpisode.servers.length <= 1) {
      showToast("Tất cả nguồn phát hiện tại đều gặp sự cố.");
      return;
    }

    const currentIndex = currentEpisode.servers.findIndex(
      (s) => s.id === selectedServerId,
    );
    const nextServer =
      currentEpisode.servers[currentIndex + 1] || currentEpisode.servers[0];

    if (nextServer && nextServer.id !== selectedServerId) {
      showToast(
        `Nguồn phát quá tải. Đang đổi sang ${nextServer.server_name}...`,
      );
      setSelectedServerId(nextServer.id);
    }
  }, [currentEpisode, selectedServerId, showToast]);

  // Ghi nhận lượt xem (chỉ 1 lần mỗi tập)
  const handleVideoPlay = () => {
    if (!hasCountedViewRef.current && currentEpisode?.id) {
      hasCountedViewRef.current = true;
      movieService.increaseEpisodeView(currentEpisode.id).catch((err) => {
        console.error("Lỗi tăng view:", err);
      });
    }
  };

  // Resume Playback: Khôi phục mốc thời gian cũ khi nạp xong Metadata
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !slug) return;

    const progressKey = `cw_progress_${slug}_ep_${currentEpNum}`;
    const savedTimeStr = localStorage.getItem(progressKey);

    if (savedTimeStr) {
      const savedTime = parseFloat(savedTimeStr);
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

  // Lưu tiến trình xem vào localStorage mỗi 5 giây
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

  // Autoplay Next: Đếm ngược chuyển tập khi video kết thúc
  const handleVideoEnded = () => {
    if (slug) {
      localStorage.removeItem(`cw_progress_${slug}_ep_${currentEpNum}`);
    }

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

  // Hủy đếm ngược chuyển tập
  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setNextEpisodeCountdown(null);
  };

  // Xử lý bật/tắt yêu thích (Watchlist)
  const handleToggleFavorite = () => {
    if (!slug) return;
    const watchlist: string[] = JSON.parse(
      localStorage.getItem("cw_watchlist") || "[]",
    );

    let updatedList: string[];
    if (isFavorite) {
      updatedList = watchlist.filter((s) => s !== slug);
      setIsFavorite(false);
      showToast("Đã xóa khỏi danh sách yêu thích!");
    } else {
      updatedList = [...watchlist, slug];
      setIsFavorite(true);
      showToast("Đã thêm vào danh sách yêu thích!");
    }
    localStorage.setItem("cw_watchlist", JSON.stringify(updatedList));
  };

  // Xử lý gửi đánh giá điểm sao
  const handleSubmitRating = (score: number) => {
    if (!slug) return;
    setUserRating(score);
    localStorage.setItem(`cw_rating_${slug}`, score.toString());
    setShowRatingModal(false);
    showToast(`Cảm ơn bạn đã đánh giá ${score}/10 sao cho bộ phim!`);
  };

  // Xử lý gửi ticket báo lỗi tập phim nhận từ ReportModal
  const handleSubmitReport = async (data: ReportPayload) => {
    if (!movie || !currentEpisode) return;

    try {
      const payload = {
        movieId: movie.id,
        episodeId: currentEpisode.id,
        serverId: selectedServerId || currentSource?.id || null,
        reason: data.reason,
        description: data.description,
        currentTimestamp: Math.floor(videoRef.current?.currentTime || 0),
      };

      console.log("🚩 Gửi ticket báo lỗi tập phim:", payload);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setShowReportModal(false);
      showToast("Cảm ơn bạn! Đã gửi báo lỗi tới ban quản trị.");
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo sự cố:", error);
      showToast("Có lỗi xảy ra khi gửi báo lỗi. Vui lòng thử lại!");
    }
  };

  // Helper chuyển giây sang định dạng MM:SS
  const formatSecondsToTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper chuyển chuỗi MM:SS sang số giây
  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  // Tua video khi click vào Timestamp trong bình luận
  const handleSeekToTimestamp = (seconds: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = seconds;
      video.play().catch(() => {});
      playerContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      showToast(`Đã chuyển tới ${formatSecondsToTime(seconds)}`);
    }
  };

  // Nút chèn mốc thời gian hiện tại vào ô nhập
  const handleInsertCurrentTime = () => {
    const video = videoRef.current;
    const currentSec = Math.floor(video?.currentTime || 0);
    const timeFormatted = `[${formatSecondsToTime(currentSec)}]`;
    setNewCommentText((prev) =>
      prev ? `${prev} ${timeFormatted} ` : `${timeFormatted} `,
    );
  };

  // Gửi bình luận mới
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !slug) return;

    const currentSec = Math.floor(videoRef.current?.currentTime || 0);
    const commentItem: EpisodeComment = {
      id: `comment_${Date.now()}`,
      userName: "Khán giả CineWrap",
      avatar: "🎬",
      content: newCommentText.trim(),
      isSpoiler: isCommentSpoiler,
      timestampSeconds: newCommentText.includes("[") ? currentSec : undefined,
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedComments = [commentItem, ...comments];
    setComments(updatedComments);
    localStorage.setItem(
      `cw_comments_${slug}_ep_${currentEpNum}`,
      JSON.stringify(updatedComments),
    );

    setNewCommentText("");
    setIsCommentSpoiler(false);
    showToast("Đã đăng bình luận của bạn!");
  };

  // Mở/Đóng nội dung spoiler
  const toggleRevealSpoiler = (commentId: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Render text có thể click vào timestamp
  const renderCommentContent = (content: string) => {
    const parts = content.split(/(\[\d{1,2}:\d{2}(?::\d{2})?\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/);
      if (match) {
        const timeStr = match[1];
        const sec = parseTimeToSeconds(timeStr);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleSeekToTimestamp(sec)}
            className="inline-flex items-center gap-1 rounded-md bg-[#00a3ff]/20 px-1.5 py-0.5 text-xs font-bold text-[#00a3ff] hover:bg-[#00a3ff]/30 transition cursor-pointer mx-1"
          >
            ⏱️ {timeStr}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // ── 4. KHAI BÁO CÁC SIDE EFFECTS (USEEFFECT) ──

  // Effect 1: Cuộn mượt vào khung phát khi bật Chế độ Rạp phim
  useEffect(() => {
    if (isCinemaMode && playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isCinemaMode]);

  // Effect 2: Tải dữ liệu bộ phim và chi tiết tập phim từ NestJS
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    hasCountedViewRef.current = false;

    const fetchWatchData = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setNextEpisodeCountdown(null);

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

          // Load danh sách bình luận từ localStorage
          const savedCommentsKey = `cw_comments_${slug}_ep_${currentEpNum}`;
          const localComments = JSON.parse(
            localStorage.getItem(savedCommentsKey) || "[]",
          );
          setComments(localComments);

          // Đọc trạng thái yêu thích & đánh giá sao an toàn sau khi load dữ liệu
          const watchlist: string[] = JSON.parse(
            localStorage.getItem("cw_watchlist") || "[]",
          );
          setIsFavorite(watchlist.includes(slug));

          const savedRating = localStorage.getItem(`cw_rating_${slug}`);
          if (savedRating) {
            setUserRating(Number(savedRating));
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
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [slug, currentEpNum]);

  // Effect 3: Nạp và phát luồng Stream HLS / MP4 với cơ chế Fallback
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

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn("HLS Network Error -> Chuyển server dự phòng");
                triggerServerFallback();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                triggerServerFallback();
                break;
            }
          }
        });

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
  }, [currentSource?.url, triggerServerFallback]);

  // Effect 4: Lắng nghe phím tắt điều khiển (Keyboard Shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;
      if (isInput) return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 5);
          showToast(`Tua tới +5s (${Math.floor(video.currentTime)}s)`);
          break;

        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          showToast(`Tua lùi -5s (${Math.floor(video.currentTime)}s)`);
          break;

        case "ArrowUp":
          e.preventDefault();
          video.volume = Math.min(1, Number((video.volume + 0.1).toFixed(1)));
          showToast(`Âm lượng: ${Math.round(video.volume * 100)}%`);
          break;

        case "ArrowDown":
          e.preventDefault();
          video.volume = Math.max(0, Number((video.volume - 0.1).toFixed(1)));
          showToast(`Âm lượng: ${Math.round(video.volume * 100)}%`);
          break;

        case "KeyM":
          e.preventDefault();
          video.muted = !video.muted;
          showToast(video.muted ? "Đã tắt âm (Mute)" : "Đã bật âm");
          break;

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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showToast]);

  // ── 5. CONDITIONAL EARLY RETURNS ──
  if (isLoading) {
    return <WatchPageSkeleton />;
  }

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

  // ── 6. RENDER GIAO DIỆN (JSX) ──
  return (
    <main className="min-h-screen w-full bg-[#0d1425] font-sans text-white overflow-x-hidden">
      {/* Phông nền đen bao phủ khi bật Chế độ Rạp Phim */}
      {isCinemaMode && (
        <div
          className="fixed inset-0 z-40 bg-black/95 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
          onClick={() => setIsCinemaMode(false)}
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
                onPlay={handleVideoPlay}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onError={triggerServerFallback}
                className="w-full h-full object-contain block relative z-10"
              >
                Trình duyệt của bạn không hỗ trợ phát video.
              </video>

              {/* Overlay Đếm ngược chuyển tập tự động */}
              {nextEpisodeCountdown !== null && navigation.next && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in">
                  <p className="text-xs uppercase tracking-widest text-[#9ca3af] mb-1">
                    Chuẩn bị phát tiếp
                  </p>
                  <h3 className="text-lg sm:text-2xl font-black text-white mb-4">
                    Tập {navigation.next.episode_number}
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
            {/* Nút Yêu thích */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                isFavorite
                  ? "border-pink-500/50 bg-pink-500/20 text-pink-400"
                  : "border-white/10 bg-[#0f172a] text-[#9ca3af] hover:text-white"
              }`}
            >
              <span>{isFavorite ? "❤️" : "🤍"}</span>
              <span>{isFavorite ? "Đã Thích" : "Yêu Thích"}</span>
            </button>

            {/* Nút Đánh giá */}
            <button
              type="button"
              onClick={() => setShowRatingModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-xs font-bold text-[#ffc107] hover:bg-[#1e293b] transition cursor-pointer"
            >
              <span>★</span>
              <span>{userRating ? `${userRating}/10` : "Đánh Giá"}</span>
            </button>

            {/* Nút Chế độ rạp phim */}
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
              onClick={() => setShowReportModal(true)}
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

            {/* ── 4. PHÂN HỆ BÌNH LUẬN THEO TẬP ── */}
            <div className="mt-8 rounded-2xl bg-[#131c2e]/70 border border-white/10 p-5 sm:p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>💬</span> Bình Luận & Thảo Luận
                  <span className="text-xs font-normal text-[#00a3ff] bg-[#00a3ff]/10 px-2.5 py-0.5 rounded-full">
                    Tập {currentEpisode.episode_number} ({comments.length})
                  </span>
                </h3>
              </div>

              {/* Form gửi bình luận */}
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Chia sẻ cảm nghĩ của bạn về tập phim này..."
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs sm:text-sm text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none transition resize-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Nút Chèn Timestamp */}
                    <button
                      type="button"
                      onClick={handleInsertCurrentTime}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-xs font-semibold text-[#00a3ff] hover:bg-[#1e293b] transition cursor-pointer"
                    >
                      ⏱️ Chèn mốc thời gian
                    </button>

                    {/* Checkbox Spoiler */}
                    <label className="flex items-center gap-2 text-xs font-medium text-[#9ca3af] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isCommentSpoiler}
                        onChange={(e) => setIsCommentSpoiler(e.target.checked)}
                        className="rounded border-white/20 bg-[#0f172a] text-[#00a3ff] focus:ring-0"
                      />
                      <span>⚠️ Tiết lộ phim (Spoiler)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="rounded-xl bg-[#00a3ff] px-5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Gửi bình luận
                  </button>
                </div>
              </form>

              {/* Danh sách bình luận */}
              <div className="space-y-4 pt-2">
                {comments.length > 0 ? (
                  comments.map((comment) => {
                    const isRevealed = revealedSpoilers[comment.id];
                    return (
                      <div
                        key={comment.id}
                        className="flex gap-3 rounded-xl bg-[#0f172a]/60 border border-white/5 p-4 transition"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-base border border-white/10">
                          {comment.avatar}
                        </div>
                        <div className="flex-1 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              {comment.userName}
                            </span>
                            <span className="text-[11px] text-[#64748b]">
                              {comment.createdAt}
                            </span>
                          </div>

                          {comment.isSpoiler && !isRevealed ? (
                            <div
                              onClick={() => toggleRevealSpoiler(comment.id)}
                              className="rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-center text-red-300 font-semibold cursor-pointer hover:bg-red-500/20 transition"
                            >
                              ⚠️ Bình luận có chứa nội dung tiết lộ phim. Bấm để
                              xem.
                            </div>
                          ) : (
                            <div className="text-[#cbd5e1] leading-relaxed pt-1">
                              {renderCommentContent(comment.content)}
                              {comment.isSpoiler && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleRevealSpoiler(comment.id)
                                  }
                                  className="block text-[10px] text-red-400 mt-1 hover:underline cursor-pointer"
                                >
                                  Ẩn lại
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-6 text-xs text-[#64748b] italic">
                    Chưa có bình luận nào cho tập phim này. Hãy là người đầu
                    tiên để lại cảm nghĩ!
                  </p>
                )}
              </div>
            </div>
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

      {/* Modal đánh giá phim */}
      <RatingModal
        isOpen={showRatingModal}
        movieTitle={movie.title}
        initialRating={userRating}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
      />

      {/* Modal báo lỗi tập phim */}
      <ReportModal
        isOpen={showReportModal}
        movieTitle={movie.title}
        episodeNumber={currentEpisode.episode_number}
        serverName={currentSource?.server_name}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
      />

      <Footer />
    </main>
  );
};

export default WatchPage;
