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
  // State phim & tập
  const [movies, setMovies] = useState<BackendMovie[]>([]);
  const [selectedMovieSlug, setSelectedMovieSlug] = useState<string>("");
  const [episodes, setEpisodes] = useState<EpisodeOption[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    null,
  );

  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // State tìm kiếm phim trong Dropdown (Searchable Combobox)
  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [movieSearchKeyword, setMovieSearchKeyword] = useState("");
  const movieDropdownRef = useRef<HTMLDivElement>(null);

  // Form State thêm/sửa
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

  // 1. Tải danh sách phim ban đầu
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

  // 2. Tải chi tiết tập và server khi chọn phim
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

  // Click outside để đóng combobox tìm phim
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

  // Danh sách phim sau khi lọc theo từ khóa tìm kiếm
  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(movieSearchKeyword.toLowerCase()) ||
      m.slug.toLowerCase().includes(movieSearchKeyword.toLowerCase()),
  );

  const selectedMovie = movies.find((m) => m.slug === selectedMovieSlug);
  const currentEpisode = episodes.find((ep) => ep.id === selectedEpisodeId);
  const currentServers = currentEpisode?.servers || [];

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingServerId(null);
    setServerName("Server VIP (HLS)");
    setServerUrl("");
    setQuality("1080p");
    setShowModal(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (src: VideoServerSource) => {
    setEditingServerId(src.id);
    setServerName(src.server_name);
    setServerUrl(src.url);
    setQuality(src.quality || "1080p");
    setShowModal(true);
  };

  // Lưu Server
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

  // Xóa Server
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
        <div className="fixed top-20 right-8 z-50 rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Thanh chọn Phim (Searchable Combobox) và chọn Tập */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-[#131c2e]/80 border border-white/10 p-5">
        {/* 1. Ô TÌM & CHỌN PHIM DẠNG COMBOBOX */}
        <div className="space-y-1.5 relative" ref={movieDropdownRef}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#9ca3af]">
              1. Chọn bộ phim cần quản lý
            </label>
            <span className="text-[10px] text-[#00a3ff] font-semibold">
              {movies.length} phim trong hệ thống
            </span>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            disabled={isLoadingMovies}
            onClick={() => setIsMovieDropdownOpen(!isMovieDropdownOpen)}
            className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-bold text-white focus:border-[#00a3ff] focus:outline-none cursor-pointer transition hover:bg-white/5 text-left"
          >
            <span className="truncate">
              {selectedMovie
                ? `${selectedMovie.title} (${selectedMovie.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"})`
                : "Đang tải danh sách phim..."}
            </span>
            <span className="text-[#9ca3af] text-[10px] pl-2 shrink-0">▼</span>
          </button>

          {/* Dropdown Menu có thanh Search */}
          {isMovieDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full rounded-2xl bg-[#0f172a] border border-white/15 shadow-2xl z-50 p-2 space-y-2 animate-fade-in backdrop-blur-xl">
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
                    className="absolute right-2.5 top-2 text-xs text-[#9ca3af] hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pr-1">
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
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                          isSelected
                            ? "bg-[#00a3ff] text-white shadow-md"
                            : "text-[#cbd5e1] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{m.title}</span>
                        <span
                          className={`text-[10px] ml-2 px-1.5 py-0.5 rounded font-bold shrink-0 ${
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

        {/* 2. Ô CHỌN TẬP PHIM */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#9ca3af]">
            2. Chọn tập phim
          </label>
          <select
            value={selectedEpisodeId || ""}
            disabled={isLoadingDetails || episodes.length === 0}
            onChange={(e) => setSelectedEpisodeId(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-bold text-white focus:border-[#00a3ff] focus:outline-none disabled:opacity-40"
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

      {/* Header và Bảng danh sách Servers */}
      <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>📺</span> Danh Sách Nguồn Phát (Video Servers)
            </h3>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              Đang chọn: {selectedMovie?.title} — Tập{" "}
              {currentEpisode?.episode_number || 1} ({currentServers.length}{" "}
              nguồn khả dụng)
            </p>
          </div>

          <button
            type="button"
            disabled={!selectedEpisodeId}
            onClick={handleOpenAddModal}
            className="rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition disabled:opacity-40 cursor-pointer"
          >
            + Thêm Link Server Mới
          </button>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-[#64748b]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Tên Máy Chủ</th>
                <th className="p-3.5">Chất Lượng</th>
                <th className="p-3.5">Đường Dẫn Stream (URL)</th>
                <th className="p-3.5 text-right rounded-r-xl">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
              {currentServers.length > 0 ? (
                currentServers.map((src) => (
                  <tr key={src.id} className="hover:bg-white/5 transition">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      {src.server_name}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-[#00a3ff]/20 text-[#00a3ff] px-2 py-0.5 rounded-md font-bold text-[11px]">
                        {src.quality || "HD"}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] truncate max-w-md text-[#9ca3af]">
                      {src.url}
                    </td>
                    <td className="p-3.5 text-right space-x-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(src)}
                        className="text-[#00a3ff] hover:underline font-semibold cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteServer(src.id)}
                        className="text-red-400 hover:underline font-semibold cursor-pointer"
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

      {/* Modal Thêm/Sửa Server */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#131c2e] border border-white/10 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
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
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
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
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-mono text-white focus:border-[#00a3ff] focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Độ phân giải / Chất lượng
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
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
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!serverName.trim() || !serverUrl.trim()}
                  className="flex-1 rounded-xl bg-[#00a3ff] py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
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
