import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Skeleton } from "../components/common/Skeleton";

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

interface ServerSource {
  id: string;
  name: string;
  quality: string;
  url: string;
}

interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  duration?: string;
  thumbnail?: string;
  sources: ServerSource[];
}

interface WatchMovieData {
  id: string;
  title: string;
  slug: string;
  type: "SINGLE" | "SERIES";
  rating: string;
  year: number;
  viewCount: number;
  synopsis: string;
  episodes: Episode[];
}

// ---------------------------------------------------------------------------
// Mock Data cho WatchPage
// ---------------------------------------------------------------------------

const MOCK_WATCH_DATA: WatchMovieData = {
  id: "m-101",
  title: "Đấu Phá Thương Khung: Niên Phiên",
  slug: "dau-pha-thuong-khung-nien-phien",
  type: "SERIES",
  rating: "9.4",
  year: 2024,
  viewCount: 128450,
  synopsis:
    "Tiêu Viêm sau khi giải quyết ân oán với Vân Lam Tông đã lên đường đến Già Nam Học Viện để tìm kiếm dị hỏa tiếp theo...",
  episodes: Array.from({ length: 12 }).map((_, idx) => ({
    id: idx + 1,
    episodeNumber: idx + 1,
    title: `Tập ${idx + 1}: Quyết Chiến Tân Sinh`,
    duration: "24 phút",
    thumbnail: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=170&fit=crop&auto=format&q=80`,
    sources: [
      {
        id: "server-vip",
        name: "Server VIP 1 (HLS)",
        quality: "4K Ultra",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "server-backup",
        name: "Server Dự Phòng 2",
        quality: "Full HD 1080p",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
    ],
  })),
};

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

const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [movieData, setMovieData] = useState<WatchMovieData | null>(null);

  // Trạng thái Player
  const currentEpNum = parseInt(searchParams.get("ep") || "1", 10);
  const [selectedServerId, setSelectedServerId] =
    useState<string>("server-vip");
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ref quản lý khung Player
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn góc nhìn vào giữa Player khi Bật/Tắt Rạp phim
  useEffect(() => {
    if (isCinemaMode && playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isCinemaMode]);

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Giả lập nạp dữ liệu tập phim
    const timer = setTimeout(() => {
      setMovieData(MOCK_WATCH_DATA);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [slug, currentEpNum]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Đổi tập phim
  const handleSelectEpisode = (epNum: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("ep", epNum.toString());
    setSearchParams(newParams);
  };

  // Chuyển sang tập kế tiếp
  const handleNextEpisode = () => {
    if (!movieData) return;
    if (currentEpNum < movieData.episodes.length) {
      handleSelectEpisode(currentEpNum + 1);
    } else {
      showToast("Bạn đang ở tập mới nhất!");
    }
  };

  // Chuyển sang tập trước đó
  const handlePrevEpisode = () => {
    if (currentEpNum > 1) {
      handleSelectEpisode(currentEpNum - 1);
    } else {
      showToast("Bạn đang ở tập đầu tiên!");
    }
  };

  if (isLoading || !movieData) {
    return <WatchPageSkeleton />;
  }

  // Lấy tập phim hiện tại
  const currentEpisode =
    movieData.episodes.find((e) => e.episodeNumber === currentEpNum) ||
    movieData.episodes[0];

  // Lấy server video hiện tại
  const currentSource =
    currentEpisode.sources.find((s) => s.id === selectedServerId) ||
    currentEpisode.sources[0];

  return (
    <main className="min-h-screen w-full bg-[#0d1425] font-sans text-cine-text overflow-x-hidden">
      {/* Phông nền đen bao phủ khi bật Chế độ Rạp Phim (Cinema Mode) */}
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
            onClick={() => navigate("/")}
            className="hover:text-white transition"
          >
            Trang chủ
          </button>
          <span>/</span>
          <button
            onClick={() => navigate(`/movie/${movieData.slug}`)}
            className="hover:text-white transition"
          >
            {movieData.title}
          </button>
          <span>/</span>
          <span className="text-[#00a3ff] font-semibold">
            {movieData.type === "SINGLE" ? "Phim Lẻ" : `Tập ${currentEpNum}`}
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
          <video
            ref={videoRef}
            key={`${currentEpisode.id}-${currentSource.id}`}
            controls
            autoPlay
            className="h-full w-full object-contain"
          >
            <source src={currentSource.url} type="video/mp4" />
            Trình phát video không được trình duyệt hỗ trợ.
          </video>
        </div>

        {/* ── 2. PLAYER ACTION BAR (Chuyển tập, Đổi Server, Rạp phim) ── */}
        <div className="relative z-[90] flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#131c2e]/80 border border-white/10 p-4 backdrop-blur-xl">
          {/* Cụm điều hướng Tập trước/Tập sau */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentEpNum <= 1}
              onClick={handlePrevEpisode}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#1e293b] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ‹ Tập trước
            </button>
            <button
              type="button"
              disabled={currentEpNum >= movieData.episodes.length}
              onClick={handleNextEpisode}
              className="flex items-center gap-1 rounded-xl bg-[#00a3ff] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Tập tiếp ›
            </button>
          </div>

          {/* Cụm đổi Server nguồn phát */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-[#9ca3af] font-medium shrink-0">
              Server:
            </span>
            {currentEpisode.sources.map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => setSelectedServerId(src.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                  selectedServerId === src.id
                    ? "bg-[#00a3ff] text-white shadow-[0_0_12px_rgba(0,163,255,0.4)]"
                    : "bg-[#0f172a] text-[#9ca3af] hover:text-white"
                }`}
              >
                {src.name} ({src.quality})
              </button>
            ))}
          </div>

          {/* Cụm tính năng Rạp phim & Báo lỗi */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-extrabold transition active:scale-95 ${
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
              className="rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
            >
              🚩 Báo Lỗi Link
            </button>
          </div>
        </div>

        {/* ── 3. THÔNG TIN PHIM VÀ DANH SÁCH TẬP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Cột Trái (2/3): Thông tin tập phim đang xem */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {movieData.title} - {currentEpisode.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                <span>👁 {movieData.viewCount.toLocaleString()} lượt xem</span>
                <span>•</span>
                <span>Năm {movieData.year}</span>
                <span>•</span>
                <span className="text-[#ffc107]">★ {movieData.rating}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
              {movieData.synopsis}
            </p>
          </div>

          {/* Cột Phải (1/3): Lưới chọn tập phim nhanh */}
          <div className="rounded-2xl bg-[#131c2e]/70 border border-white/10 p-5 backdrop-blur-xl h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
              <span>Danh Sách Tập Phim</span>
              <span className="text-xs text-[#00a3ff] font-semibold">
                Tập {currentEpNum} / {movieData.episodes.length}
              </span>
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {movieData.episodes.map((ep) => {
                const isActive = ep.episodeNumber === currentEpNum;
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => handleSelectEpisode(ep.episodeNumber)}
                    className={`rounded-xl py-2.5 px-2 text-xs font-bold transition flex items-center justify-center gap-1 ${
                      isActive
                        ? "bg-[#00a3ff] text-white shadow-[0_0_12px_rgba(0,163,255,0.4)]"
                        : "bg-[#0f172a] text-[#9ca3af] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isActive && <span>▶</span>}
                    <span>Tập {ep.episodeNumber}</span>
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
