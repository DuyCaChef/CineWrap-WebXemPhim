import React, { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  CircleCheck,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Server,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { movieService } from "../../../services/movieService";
import type {
  BackendMovie,
  VideoServerSource,
} from "../../../services/movieService";

interface EpisodeOption {
  id: number;
  episode_number: number;
  title?: string;
  servers: VideoServerSource[];
}

interface SeasonItem {
  id: number;
  season_number: number;
  title?: string;
  episodes?: EpisodeOption[];
}

export const ServerManagerTab: React.FC = () => {
  const [movies, setMovies] = useState<BackendMovie[]>([]);
  const [selectedMovieSlug, setSelectedMovieSlug] = useState<string>("");
  const [episodes, setEpisodes] = useState<EpisodeOption[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    null,
  );

  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [movieSearchKeyword, setMovieSearchKeyword] = useState("");
  const movieDropdownRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingServerId, setEditingServerId] = useState<number | null>(null);
  const [serverName, setServerName] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoadingMovies(true);
        const res = await movieService.getMovies({ page: 1, limit: 100 });
        setMovies(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedMovieSlug(res.data[0].slug);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      } finally {
        setIsLoadingMovies(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!selectedMovieSlug) return;

    const fetchMovieDetails = async () => {
      try {
        setIsLoadingDetails(true);
        const movieData = await movieService.getMovieBySlug(selectedMovieSlug);

        let extractedEpisodes: EpisodeOption[] = [];
        if (movieData.type === "SERIES") {
          const seasonsList = (movieData.seasons || []) as SeasonItem[];
          extractedEpisodes = seasonsList
            .flatMap((s: SeasonItem) => s.episodes || [])
            .map((ep: EpisodeOption) => ({
              id: ep.id,
              episode_number: ep.episode_number,
              title: ep.title,
              servers: ep.servers || [],
            }));
        } else {
          const rawEpisodes = (movieData.episodes || []) as EpisodeOption[];
          extractedEpisodes = rawEpisodes.map((ep: EpisodeOption) => ({
            id: ep.id,
            episode_number: ep.episode_number,
            title: ep.title,
            servers: ep.servers || [],
          }));
        }

        setEpisodes(extractedEpisodes);
        if (extractedEpisodes.length > 0) {
          setSelectedEpisodeId(extractedEpisodes[0].id);
        } else {
          setSelectedEpisodeId(null);
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết tập phim:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchMovieDetails();
  }, [selectedMovieSlug]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        movieDropdownRef.current &&
        !movieDropdownRef.current.contains(e.target as Node)
      ) {
        setIsMovieDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(movieSearchKeyword.toLowerCase()) ||
      m.slug.toLowerCase().includes(movieSearchKeyword.toLowerCase()),
  );

  const selectedMovie = movies.find((m) => m.slug === selectedMovieSlug);
  const currentEpisode = episodes.find((ep) => ep.id === selectedEpisodeId);
  const currentServers = currentEpisode?.servers || [];

  const handleOpenAddModal = () => {
    setEditingServerId(null);
    setServerName("Server VIP (HLS)");
    setServerUrl("");
    setQuality("1080p");
    setShowModal(true);
  };

  const handleOpenEditModal = (src: VideoServerSource) => {
    setEditingServerId(src.id);
    setServerName(src.server_name);
    setServerUrl(src.url);
    setQuality(src.quality || "1080p");
    setShowModal(true);
  };

  const handleSaveServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim() || !serverUrl.trim() || !selectedEpisodeId) return;

    if (editingServerId) {
      setEpisodes((prev) =>
        prev.map((ep) => {
          if (ep.id !== selectedEpisodeId) return ep;
          return {
            ...ep,
            servers: ep.servers.map((s) =>
              s.id === editingServerId
                ? {
                    ...s,
                    server_name: serverName.trim(),
                    url: serverUrl.trim(),
                    quality,
                  }
                : s,
            ),
          };
        }),
      );
      showToast("✓ Đã cập nhật thông tin Server phát!");
    } else {
      const newServer: VideoServerSource = {
        id: Date.now(),
        server_name: serverName.trim(),
        url: serverUrl.trim(),
        quality,
      };
      setEpisodes((prev) =>
        prev.map((ep) => {
          if (ep.id !== selectedEpisodeId) return ep;
          return {
            ...ep,
            servers: [...ep.servers, newServer],
          };
        }),
      );
      showToast("✓ Đã thêm nguồn Server mới thành công!");
    }

    setShowModal(false);
  };

  const handleDeleteServer = (serverId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa link phát này không?"))
      return;

    setEpisodes((prev) =>
      prev.map((ep) => {
        if (ep.id !== selectedEpisodeId) return ep;
        return {
          ...ep,
          servers: ep.servers.filter((s) => s.id !== serverId),
        };
      }),
    );
    showToast("✓ Đã xóa nguồn phát!");
  };

  return (
    <div className="min-w-0 max-w-full h-full space-y-6 overflow-x-hidden">
      {toastMessage && (
        <div className="fixed left-3 right-3 top-20 z-50 flex min-h-11 items-center justify-center rounded-xl border border-[#7dd3fc]/30 bg-[#0f172a] px-4 py-2.5 text-center text-xs font-bold text-[#7dd3fc] shadow-2xl animate-fade-in sm:left-auto sm:right-8 sm:max-w-sm">
          <CircleCheck
            className="mr-2 h-4 w-4 shrink-0 text-[#34d399]"
            strokeWidth={2.2}
          />
          {toastMessage}
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,28,46,0.96),rgba(13,20,37,0.92))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:gap-5 sm:p-5 lg:grid-cols-2">
        <div className="relative space-y-1.5" ref={movieDropdownRef}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#9ca3af]">
              1. Chọn bộ phim cần quản lý
            </label>
            <span className="text-[10px] font-semibold text-[#7dd3fc]">
              {movies.length} phim trong hệ thống
            </span>
          </div>

          <button
            type="button"
            disabled={isLoadingMovies}
            onClick={() => setIsMovieDropdownOpen(!isMovieDropdownOpen)}
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0f172a] p-3 text-left text-xs font-bold text-white transition hover:border-[#00a3ff]/40 hover:bg-white/5 focus:border-[#00a3ff] focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="truncate">
              {selectedMovie
                ? `${selectedMovie.title} (${selectedMovie.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"})`
                : "Đang tải danh sách phim..."}
            </span>
            {isLoadingMovies ? (
              <LoaderCircle
                className="h-4 w-4 shrink-0 animate-spin text-[#7dd3fc]"
                strokeWidth={2.2}
              />
            ) : (
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#9ca3af] transition ${isMovieDropdownOpen ? "rotate-180" : ""}`}
                strokeWidth={2.2}
              />
            )}
          </button>

          {isMovieDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-[#00a3ff]/20 bg-[#0b1220] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl animate-fade-in">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]"
                  strokeWidth={2.2}
                />
                <input
                  type="text"
                  autoFocus
                  value={movieSearchKeyword}
                  onChange={(e) => setMovieSearchKeyword(e.target.value)}
                  placeholder="Gõ tên phim hoặc slug để tìm nhanh..."
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-[#131c2e] py-2 pl-10 pr-11 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none"
                />
                {movieSearchKeyword && (
                  <button
                    type="button"
                    onClick={() => setMovieSearchKeyword("")}
                    aria-label="Xóa tìm kiếm"
                    className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg text-[#9ca3af] transition hover:bg-white/5 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                )}
              </div>

              <div className="custom-scrollbar max-h-60 space-y-1 overflow-y-auto pr-1">
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((m) => {
                    const isSelected = m.slug === selectedMovieSlug;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedMovieSlug(m.slug);
                          setIsMovieDropdownOpen(false);
                          setMovieSearchKeyword("");
                        }}
                        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-[#00a3ff] text-white shadow-md"
                            : "text-[#cbd5e1] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{m.title}</span>
                        <span
                          className={`ml-2 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-white/5 text-[#9ca3af]"
                          }`}
                        >
                          {m.type === "SINGLE" ? "Lẻ" : "Bộ"}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-[#64748b] italic">
                    Không tìm thấy phim phù hợp với "{movieSearchKeyword}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#9ca3af]">
            2. Chọn tập phim
          </label>
          <select
            value={selectedEpisodeId || ""}
            disabled={isLoadingDetails || episodes.length === 0}
            onChange={(e) => setSelectedEpisodeId(Number(e.target.value))}
            className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-bold text-white transition focus:border-[#00a3ff] focus:outline-none disabled:opacity-40"
          >
            {episodes.length > 0 ? (
              episodes.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  Tập {ep.episode_number} {ep.title ? `- ${ep.title}` : ""} (
                  {ep.servers.length} servers)
                </option>
              ))
            ) : (
              <option value="">Chưa có tập phim nào</option>
            )}
          </select>
        </div>
      </div>

      <div className="min-w-0 space-y-4 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,39,0.96),rgba(11,18,28,0.94))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-6">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <Server
                className="h-5 w-5 shrink-0 text-[#7dd3fc]"
                strokeWidth={2.2}
              />
              Danh Sách Nguồn Phát
            </h3>
            <p className="mt-1 wrap-break-word text-xs text-[#9ca3af]">
              Đang chọn: {selectedMovie?.title} — Tập{" "}
              {currentEpisode?.episode_number || 1} ({currentServers.length}{" "}
              nguồn khả dụng)
            </p>
          </div>

          <button
            type="button"
            disabled={!selectedEpisodeId}
            onClick={handleOpenAddModal}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(0,163,255,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer sm:w-auto"
          >
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            Thêm Link Server Mới
          </button>
        </div>

        <div className="max-w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-150 text-left text-xs">
            <thead className="bg-[#0f172a] text-[#64748b]">
              <tr>
                <th className="whitespace-nowrap rounded-l-xl p-3.5">
                  Tên Máy Chủ
                </th>
                <th className="whitespace-nowrap p-3.5">Chất Lượng</th>
                <th className="whitespace-nowrap p-3.5">
                  Đường Dẫn Stream (URL)
                </th>
                <th className="whitespace-nowrap rounded-r-xl p-3.5 text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
              {currentServers.length > 0 ? (
                currentServers.map((src) => (
                  <tr key={src.id} className="transition hover:bg-white/5">
                    <td className="whitespace-nowrap p-3.5 font-bold text-white">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        {src.server_name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-3.5">
                      <span className="rounded-md bg-[#00a3ff]/20 px-2 py-0.5 text-[11px] font-bold text-[#00a3ff]">
                        {src.quality || "HD"}
                      </span>
                    </td>
                    <td className="max-w-md truncate whitespace-nowrap p-3.5 font-mono text-[11px] text-[#9ca3af]">
                      {src.url}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(src)}
                          aria-label={`Sửa ${src.server_name}`}
                          className="flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 font-semibold text-[#7dd3fc] transition hover:bg-[#00a3ff]/10 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteServer(src.id)}
                          aria-label={`Xóa ${src.server_name}`}
                          className="flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 font-semibold text-red-400 transition hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-[#64748b] italic"
                  >
                    Tập phim này chưa có nguồn phát video nào. Hãy bấm nút "+
                    Thêm Link Server Mới".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#00a3ff]/20 bg-[linear-gradient(180deg,rgba(19,28,46,0.99),rgba(11,18,31,0.99))] p-4 shadow-2xl shadow-black/50 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
              <Zap className="h-5 w-5 text-[#fbbf24]" strokeWidth={2.2} />
              {editingServerId
                ? "Cập Nhật Nguồn Phát"
                : "Thêm Nguồn Stream Mới"}
            </h3>

            <form onSubmit={handleSaveServer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Tên hiển thị Máy chủ
                </label>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Ví dụ: Server VIP 1 (HLS), KKPhim..."
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Đường dẫn Stream (m3u8 / mp4)
                </label>
                <textarea
                  rows={3}
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://.../index.m3u8"
                  className="min-h-24 w-full resize-none rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-mono text-white focus:border-[#00a3ff] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Độ phân giải / Chất lượng
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                >
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                  <option value="4K">4K Ultra HD</option>
                  <option value="Auto">Auto Quality</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="min-h-11 flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!serverName.trim() || !serverUrl.trim()}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#00a3ff] py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {editingServerId ? (
                    <>
                      <Pencil className="h-4 w-4" strokeWidth={2.2} />
                      Lưu Thay Đổi
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" strokeWidth={2.2} />
                      Tạo Server
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
