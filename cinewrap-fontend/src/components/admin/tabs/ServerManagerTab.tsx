import React, { useEffect, useState } from "react";
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
  // State quản lý danh sách server
  const [movies, setMovies] = useState<BackendMovie[]>([]);
  const [selectedMovieSlug, setSelectedMovieSlug] = useState<string>("");
  const [episodes, setEpisodes] = useState<EpisodeOption[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    null,
  );

  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form State thêm/sửa
  const [showModal, setShowModal] = useState(false);
  const [editingServerId, setEditingServerId] = useState<number | null>(null);
  const [serverName, setServerName] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hàm hiển thị thông báo toast, tự động ẩn sau 3 giây
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Tải danh sách phim ban đầu
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoadingMovies(true);
        const res = await movieService.getMovies({ page: 1, limit: 50 });
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

  // Tải chi tiết tập và server khi chọn phim
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

  // Lấy danh sách server của tập phim hiện tại
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

  // Lưu Server (Thêm mới / Cập nhật)
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

      {/* Thanh chọn Phim và chọn Tập */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-[#131c2e]/80 border border-white/10 p-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#9ca3af]">
            1. Chọn bộ phim cần quản lý
          </label>
          <select
            value={selectedMovieSlug}
            disabled={isLoadingMovies}
            onChange={(e) => setSelectedMovieSlug(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-bold text-white focus:border-[#00a3ff] focus:outline-none"
          >
            {movies.map((m) => (
              <option key={m.id} value={m.slug}>
                {m.title} ({m.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#9ca3af]">
            2. Chọn tập phim
          </label>
          <select
            value={selectedEpisodeId || ""}
            disabled={isLoadingDetails || episodes.length === 0}
            onChange={(e) => setSelectedEpisodeId(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-bold text-white focus:border-[#00a3ff] focus:outline-none"
          >
            {episodes.map((ep) => (
              <option key={ep.id} value={ep.id}>
                Tập {ep.episode_number} {ep.title ? `- ${ep.title}` : ""} (
                {ep.servers.length} servers)
              </option>
            ))}
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
              Đang chọn: Tập {currentEpisode?.episode_number || 1} — Tổng cộng{" "}
              {currentServers.length} nguồn khả dụng
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
