import React, { useState } from "react";

export const ServerManagerTab: React.FC = () => {
  const [servers, setServers] = useState([
    {
      id: 1,
      movie: "Avatar 2",
      episode: 1,
      name: "Server VIP 1 (HLS)",
      quality: "1080p",
      url: "https://stream.example.com/ep1.m3u8",
      status: "ACTIVE",
    },
    {
      id: 2,
      movie: "Avatar 2",
      episode: 1,
      name: "Server Dự Phòng 2",
      quality: "720p",
      url: "https://backup.example.com/ep1.m3u8",
      status: "ACTIVE",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [serverName, setServerName] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [quality, setQuality] = useState("1080p");

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim() || !serverUrl.trim()) return;

    setServers((prev) => [
      ...prev,
      {
        id: Date.now(),
        movie: "Avatar 2",
        episode: 1,
        name: serverName.trim(),
        quality,
        url: serverUrl.trim(),
        status: "ACTIVE",
      },
    ]);
    setServerName("");
    setServerUrl("");
    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">
            Danh Sách Video Server Hiện Có
          </h2>
          <p className="text-xs text-[#9ca3af]">
            Quản lý và điều phối các nguồn stream đa máy chủ
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-[#00a3ff] px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 transition cursor-pointer"
        >
          + Thêm Nguồn Server Mới
        </button>
      </div>

      <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0f172a] text-[#64748b] border-b border-white/10">
            <tr>
              <th className="p-4">Tên Máy Chủ</th>
              <th className="p-4">Tập Phim</th>
              <th className="p-4">Chất Lượng</th>
              <th className="p-4">Đường Dẫn Stream</th>
              <th className="p-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
            {servers.map((s) => (
              <tr key={s.id} className="hover:bg-white/5 transition">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  {s.name}
                </td>
                <td className="p-4">
                  {s.movie} - Tập {s.episode}
                </td>
                <td className="p-4">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">
                    {s.quality}
                  </span>
                </td>
                <td className="p-4 font-mono text-[11px] truncate max-w-xs">
                  {s.url}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#131c2e] border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Thêm Nguồn Stream Cho Tập Phim
            </h3>
            <form onSubmit={handleAddServer} className="space-y-3">
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Tên máy chủ (vd: Server VIP 1)"
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:outline-none"
              />
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="Đường dẫn m3u8 hoặc mp4"
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:outline-none"
              />
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white focus:outline-none"
              >
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD</option>
                <option value="4K">4K Ultra HD</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-white/10 text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-[#00a3ff] text-white"
                >
                  Lưu Nguồn Phát
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
