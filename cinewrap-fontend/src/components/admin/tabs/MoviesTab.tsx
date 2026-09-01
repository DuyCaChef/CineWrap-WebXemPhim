import React, { useEffect, useState } from "react";
import { Edit3, Film, Plus, Search, Trash2, Tv, X } from "lucide-react";
import { movieService } from "../../../services/movieService";
import type { BackendMovie } from "../../../services/movieService";
import { adminService } from "../../../services/adminService";
import type { AdminMoviePayload } from "../../../services/adminService";

interface EpisodeItem {
  id: number;
  episode_number: number;
  title: string;
  duration?: number;
}

export const MoviesTab: React.FC = () => {
  const [movies, setMovies] = useState<BackendMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "SINGLE" | "SERIES">(
    "ALL",
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Thêm/Sửa Phim
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [movieForm, setMovieForm] = useState<AdminMoviePayload>({
    title: "",
    slug: "",
    type: "SINGLE",
    status: "PUBLISHED",
    poster_url: "",
    description: "",
    release_year: 2024,
    duration: 120,
  });

  // Modal Quản lý Tập phim
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [selectedMovieForEpisodes, setSelectedMovieForEpisodes] =
    useState<BackendMovie | null>(null);
  const [episodesList, setEpisodesList] = useState<EpisodeItem[]>([]);
  const [newEpNumber, setNewEpNumber] = useState(1);
  const [newEpTitle, setNewEpTitle] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Tải danh sách phim ban đầu
  useEffect(() => {
    let isMounted = true;
    const fetchMoviesList = async () => {
      try {
        const res = await movieService.getMovies({ page: 1, limit: 100 });
        if (isMounted) {
          setMovies(res.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMoviesList();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Mở Modal Thêm mới phim
  const handleOpenAddMovie = () => {
    setEditingMovieId(null);
    setMovieForm({
      title: "",
      slug: "",
      type: "SINGLE",
      status: "PUBLISHED",
      poster_url: "",
      description: "",
      release_year: 2024,
      duration: 120,
    });
    setShowMovieModal(true);
  };

  // 3. Mở Modal Chỉnh sửa phim
  const handleOpenEditMovie = (m: BackendMovie) => {
    setEditingMovieId(m.id);
    setMovieForm({
      title: m.title,
      slug: m.slug,
      type: m.type,
      status: (m.status as "PUBLISHED" | "DRAFT") || "PUBLISHED",
      poster_url: m.poster_url || "",
      description: m.description || "",
      release_year: m.release_year || 2024,
      duration: m.duration || 120,
    });
    setShowMovieModal(true);
  };

  // 4. Lưu thông tin phim (Thêm / Sửa)
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieForm.title.trim() || !movieForm.slug.trim()) {
      showToast("✕ Vui lòng nhập đầy đủ Tên phim và Slug!");
      return;
    }

    if (editingMovieId) {
      await adminService.updateMovie(editingMovieId, movieForm);
      setMovies((prev) =>
        prev.map((m) =>
          m.id === editingMovieId
            ? {
                ...m,
                ...movieForm,
                duration: movieForm.duration ?? null,
                poster_url: movieForm.poster_url ?? null,
                description: movieForm.description ?? null,
              }
            : m,
        ),
      );
      showToast("✓ Cập nhật thông tin phim thành công!");
    } else {
      const created = await adminService.createMovie(movieForm);
      const newMovie: BackendMovie = {
        id: created.id || Date.now(),
        title: movieForm.title,
        slug: movieForm.slug,
        type: movieForm.type,
        status: movieForm.status,
        poster_url: movieForm.poster_url ?? null,
        description: movieForm.description ?? null,
        release_year: movieForm.release_year ?? 2024,
        duration: movieForm.duration ?? null,
        is_vip: false,
        view_count: 0,
        average_rating: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        episodes: [],
      };
      setMovies((prev) => [newMovie, ...prev]);
      showToast("✓ Đã thêm phim mới thành công!");
    }

    setShowMovieModal(false);
  };

  // 5. Xóa phim
  const handleDeleteMovie = async (movieId: number) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa bộ phim này cùng toàn bộ các tập liên quan?",
      )
    )
      return;
    await adminService.deleteMovie(movieId);
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    showToast("✓ Đã xóa phim khỏi hệ thống!");
  };

  // 6. Mở Modal Quản lý Tập phim
  const handleOpenEpisodesManager = async (movie: BackendMovie) => {
    setSelectedMovieForEpisodes(movie);
    try {
      const detail = await movieService.getMovieBySlug(movie.slug);
      let eps: EpisodeItem[] = [];
      if (detail.type === "SERIES") {
        eps = (detail.seasons?.flatMap((s) => s.episodes || []) || []).map(
          (ep) => ({
            id: ep.id,
            episode_number: ep.episode_number,
            title: ep.title || `Tập ${ep.episode_number}`,
            duration: ep.duration ?? undefined,
          }),
        );
      } else {
        eps = (detail.episodes || []).map((ep) => ({
          id: ep.id,
          episode_number: ep.episode_number,
          title: ep.title || `Tập ${ep.episode_number}`,
          duration: ep.duration ?? undefined,
        }));
      }
      setEpisodesList(eps);
      setNewEpNumber(eps.length + 1);
    } catch {
      setEpisodesList([]);
      setNewEpNumber(1);
    }
    setShowEpisodeModal(true);
  };

  // 7. Thêm Tập phim mới
  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovieForEpisodes) return;

    const payload = {
      movieId: selectedMovieForEpisodes.id,
      episode_number: Number(newEpNumber),
      title: newEpTitle.trim() || `Tập ${newEpNumber}`,
      duration: 45,
    };

    const res = await adminService.createEpisode(payload);
    setEpisodesList((prev) => [
      ...prev,
      {
        id: res.id || Date.now(),
        episode_number: payload.episode_number,
        title: payload.title,
        duration: payload.duration,
      },
    ]);
    setNewEpTitle("");
    setNewEpNumber((prev) => prev + 1);
    showToast(`✓ Đã tạo mới Tập ${payload.episode_number}!`);
  };

  // 8. Xóa Tập phim
  const handleDeleteEpisode = async (epId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tập phim này?")) return;
    await adminService.deleteEpisode(epId);
    setEpisodesList((prev) => prev.filter((ep) => ep.id !== epId));
    showToast("✓ Đã xóa tập phim!");
  };

  // Lọc danh sách phim
  const filteredMovies = movies.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "ALL" || m.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header & Controls Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748b]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên phim, slug..."
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none min-h-[42px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl bg-[#0f172a] p-1 border border-white/10">
            {(["ALL", "SINGLE", "SERIES"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  typeFilter === t
                    ? "bg-[#00a3ff] text-white shadow-md"
                    : "text-[#9ca3af] hover:text-white"
                }`}
              >
                {t === "ALL"
                  ? "Tất Cả"
                  : t === "SINGLE"
                    ? "Phim Lẻ"
                    : "Phim Bộ"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenAddMovie}
            className="flex min-h-[42px] items-center gap-2 rounded-xl bg-[#00a3ff] px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>Thêm Phim Mới</span>
          </button>
        </div>
      </div>

      {/* Bảng Danh Sách Phim */}
      <div className="rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="h-4 w-4 text-[#00a3ff]" />
            <span>Danh Sách Phim & Tập</span>
          </h3>
          <span className="text-xs text-[#9ca3af]">
            Hiển thị:{" "}
            <strong className="text-white">{filteredMovies.length}</strong> bộ
            phim
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead className="bg-[#0f172a] text-[#64748b]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Poster & Tên Phim</th>
                <th className="p-3.5">Định Dạng</th>
                <th className="p-3.5">Năm Phát Hành</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 text-center">Quản Lý Tập</th>
                <th className="p-3.5 text-right rounded-r-xl">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-[#64748b] italic"
                  >
                    Đang tải danh sách phim...
                  </td>
                </tr>
              ) : filteredMovies.length > 0 ? (
                filteredMovies.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition">
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md bg-[#0f172a] border border-white/10">
                        {m.poster_url ? (
                          <img
                            src={m.poster_url}
                            alt={m.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-[#64748b]">
                            No IMG
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate max-w-xs">
                          {m.title}
                        </p>
                        <p className="text-[11px] font-mono text-[#64748b] truncate max-w-xs">
                          {m.slug}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.type === "SINGLE"
                            ? "bg-blue-500/10 text-[#00a3ff]"
                            : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {m.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"}
                      </span>
                    </td>

                    <td className="p-3.5 text-[#9ca3af]">
                      {m.release_year || "2024"}
                    </td>

                    <td className="p-3.5">
                      <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                        {m.status || "PUBLISHED"}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEpisodesManager(m)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#0f172a] px-3 py-1.5 text-[11px] font-bold text-[#7dd3fc] hover:bg-white/5 transition cursor-pointer"
                      >
                        <Tv className="h-3 w-3" />
                        <span>Xem Tập</span>
                      </button>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMovie(m)}
                        className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#00a3ff] hover:bg-white/5 transition cursor-pointer"
                        title="Chỉnh sửa phim"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMovie(m.id)}
                        className="p-1.5 rounded-lg text-[#9ca3af] hover:text-red-400 hover:bg-white/5 transition cursor-pointer"
                        title="Xóa phim"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-[#64748b] italic"
                  >
                    Không tìm thấy phim phù hợp với từ khóa "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Thêm/Sửa Phim */}
      {showMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#131c2e] border border-white/10 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="h-4 w-4 text-[#00a3ff]" />
                <span>
                  {editingMovieId
                    ? "Chỉnh Sửa Thông Tin Phim"
                    : "Thêm Phim Mới Vào Hệ Thống"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMovieModal(false)}
                className="text-[#9ca3af] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Tên Phim
                </label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, title: e.target.value })
                  }
                  placeholder="Ví dụ: Avatar: Dòng Chảy Của Nước"
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#9ca3af]">
                    Movie Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.slug}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, slug: e.target.value })
                    }
                    placeholder="avatar-dong-chay-cua-nuoc"
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs font-mono text-white focus:border-[#00a3ff] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#9ca3af]">
                    Định Dạng
                  </label>
                  <select
                    value={movieForm.type}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        type: e.target.value as "SINGLE" | "SERIES",
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                  >
                    <option value="SINGLE">Phim Lẻ (Single Movie)</option>
                    <option value="SERIES">Phim Bộ (Series Movie)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#9ca3af]">
                    Năm Phát Hành
                  </label>
                  <input
                    type="number"
                    value={movieForm.release_year}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        release_year: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#9ca3af]">
                    Thời Lượng (Phút)
                  </label>
                  <input
                    type="number"
                    value={movieForm.duration}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        duration: Number(e.target.value),
                      })
                    }
                    placeholder="120"
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Đường dẫn Ảnh Poster (URL)
                </label>
                <input
                  type="text"
                  value={movieForm.poster_url}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, poster_url: e.target.value })
                  }
                  placeholder="https://.../poster.jpg"
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Nội dung tóm tắt
                </label>
                <textarea
                  rows={3}
                  value={movieForm.description}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, description: e.target.value })
                  }
                  placeholder="Tóm tắt nội dung bộ phim..."
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMovieModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#00a3ff] py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 transition cursor-pointer"
                >
                  {editingMovieId ? "Lưu Thay Đổi" : "Tạo Phim Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Quản lý Danh sách Tập phim */}
      {showEpisodeModal && selectedMovieForEpisodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#131c2e] border border-white/10 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tv className="h-4 w-4 text-[#00a3ff]" />
                  <span>Quản Lý Tập: {selectedMovieForEpisodes.title}</span>
                </h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  Tổng số: {episodesList.length} tập phim khả dụng
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEpisodeModal(false)}
                className="text-[#9ca3af] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form thêm nhanh tập mới */}
            <form onSubmit={handleAddEpisode} className="flex gap-2">
              <input
                type="number"
                min={1}
                value={newEpNumber}
                onChange={(e) => setNewEpNumber(Number(e.target.value))}
                placeholder="Tập số"
                className="w-24 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-xs font-bold text-white focus:border-[#00a3ff] focus:outline-none"
              />
              <input
                type="text"
                value={newEpTitle}
                onChange={(e) => setNewEpTitle(e.target.value)}
                placeholder="Tiêu đề tập (tùy chọn)"
                className="flex-1 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#00a3ff] px-4 py-2 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer shrink-0"
              >
                + Thêm Tập
              </button>
            </form>

            {/* Danh sách các tập */}
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {episodesList.length > 0 ? (
                episodesList.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00a3ff]/20 text-xs font-bold text-[#00a3ff]">
                        {ep.episode_number}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">
                          {ep.title || `Tập ${ep.episode_number}`}
                        </p>
                        <p className="text-[10px] text-[#64748b]">
                          {ep.duration ? `${ep.duration} phút` : "45 phút"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEpisode(ep.id)}
                      className="p-1.5 text-[#64748b] hover:text-red-400 transition cursor-pointer"
                      title="Xóa tập này"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[#64748b] italic">
                  Chưa có tập phim nào. Hãy nhập số tập ở trên để thêm.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesTab;
