import React, { useEffect, useState, useRef } from "react";
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
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed right-4 top-20 z-50 rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-fade-in sm:right-8">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-5 md:grid-cols-2">
        <div className="relative space-y-1.5" ref={movieDropdownRef}>
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#9ca3af]">
              1. Chọn bộ phim cần quản lý
            </label>
            <span className="text-[10px] font-semibold text-[#00a3ff]">
              {movies.length} phim trong hệ thống
            </span>
          </div>

          <button
            type="button"
            disabled={isLoadingMovies}
            onClick={() => setIsMovieDropdownOpen(!isMovieDropdownOpen)}
            className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-white/10 bg-[#0f172a] p-3 text-left text-xs font-bold text-white transition hover:bg-white/5 focus:border-[#00a3ff] focus:outline-none cursor-pointer"
          >
            <span className="truncate">
              {selectedMovie
                ? `${selectedMovie.title} (${selectedMovie.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"})`
                : "Đang tải danh sách phim..."}
            </span>
            <span className="shrink-0 pl-2 text-[10px] text-[#9ca3af]">▼</span>
          </button>

          {isMovieDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-white/15 bg-[#0f172a] p-2 shadow-2xl backdrop-blur-xl animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={movieSearchKeyword}
                  onChange={(e) => setMovieSearchKeyword(e.target.value)}
                  placeholder="🔍 Gõ tên phim hoặc slug để tìm nhanh..."
                  className="w-full rounded-xl border border-white/10 bg-[#131c2e] px-3.5 py-2 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none"
                />
                {movieSearchKeyword && (
                  <button
                    type="button"
                    onClick={() => setMovieSearchKeyword("")}
                    className="absolute right-2.5 top-2 cursor-pointer text-xs text-[#9ca3af] hover:text-white"
                  >
                    ✕
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
                        className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs font-semibold transition cursor-pointer ${
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
            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-bold text-white transition focus:border-[#00a3ff] focus:outline-none disabled:opacity-40"
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

      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <span>📺</span> Danh Sách Nguồn Phát (Video Servers)
            </h3>
            <p className="mt-0.5 text-xs text-[#9ca3af]">
              Đang chọn: {selectedMovie?.title} — Tập{" "}
              {currentEpisode?.episode_number || 1} ({currentServers.length}{" "}
              nguồn khả dụng)
            </p>
          </div>

          <button
            type="button"
            disabled={!selectedEpisodeId}
            onClick={handleOpenAddModal}
            className="min-h-[44px] w-full rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-40 cursor-pointer sm:w-auto"
          >
            + Thêm Link Server Mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[650px] w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-[#64748b]">
              <tr>
                <th className="rounded-l-xl p-3.5">Tên Máy Chủ</th>
                <th className="p-3.5">Chất Lượng</th>
                <th className="p-3.5">Đường Dẫn Stream (URL)</th>
                <th className="rounded-r-xl p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
              {currentServers.length > 0 ? (
                currentServers.map((src) => (
                  <tr key={src.id} className="transition hover:bg-white/5">
                    <td className="flex items-center gap-2 p-3.5 font-bold text-white">
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      {src.server_name}
                    </td>
                    <td className="p-3.5">
                      <span className="rounded-md bg-[#00a3ff]/20 px-2 py-0.5 text-[11px] font-bold text-[#00a3ff]">
                        {src.quality || "HD"}
                      </span>
                    </td>
                    <td className="max-w-md truncate p-3.5 font-mono text-[11px] text-[#9ca3af]">
                      {src.url}
                    </td>
                    <td className="space-x-3 p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(src)}
                        className="cursor-pointer font-semibold text-[#00a3ff] hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteServer(src.id)}
                        className="cursor-pointer font-semibold text-red-400 hover:underline"
                      >
                        Xóa
                      </button>
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
          <div className="max-h-[90vh] w-[92%] overflow-y-auto rounded-2xl border border-white/10 bg-[#131c2e] p-4 shadow-2xl sm:max-w-md sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
              <span>⚡</span>{" "}
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
                  className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
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
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-mono text-white focus:border-[#00a3ff] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Độ phân giải / Chất lượng
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
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
                  className="min-h-[44px] flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!serverName.trim() || !serverUrl.trim()}
                  className="min-h-[44px] flex-1 rounded-xl bg-[#00a3ff] py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {editingServerId ? "Lưu Thay Đổi" : "Tạo Server"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
