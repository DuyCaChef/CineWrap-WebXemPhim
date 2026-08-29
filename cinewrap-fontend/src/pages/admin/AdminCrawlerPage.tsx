import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import type { CrawlPageResponse } from "../../services/adminService";
import { adminService } from "../../services/adminService";

export const AdminCrawlerPage: React.FC = () => {
  const [singleSlug, setSingleSlug] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [syncResults, setSyncResults] = useState<CrawlPageResponse | null>(
    null,
  );

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString("vi-VN");
    setLogs((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  // Cào 1 phim
  const handleCrawlSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleSlug.trim()) return;

    try {
      setIsLoading(true);
      addLog(`Bắt đầu cào phim theo slug: "${singleSlug.trim()}"...`);
      const res = await adminService.crawlSingleMovie(singleSlug.trim());
      addLog(
        `✓ Thành công: Đã đồng bộ phim "${res.movie?.title || singleSlug}"`,
      );
      setSingleSlug("");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Lỗi không xác định";
      addLog(`✕ Thất bại: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cào theo page
  const handleCrawlPage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setSyncResults(null);
      addLog(`Bắt đầu quét danh sách phim tại Trang ${pageNumber}...`);

      const res = await adminService.crawlEntirePage(pageNumber);
      setSyncResults(res);
      addLog(
        `✓ Hoàn thành trang ${pageNumber}: Đồng bộ thành công ${
          res.totalSynced || 0
        } phim.`,
      );
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Lỗi không xác định";
      addLog(`✕ Lỗi cào trang: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0d1425] text-white font-sans">
      <Header />

      <div className="pt-24 pb-16 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🕷️</span> Movie Crawler Tool (Bot Cào Phim)
          </h1>
          <p className="text-xs sm:text-sm text-[#9ca3af] mt-1">
            Đồng bộ tự động thông tin phim, poster, thể loại và toàn bộ server
            video stream vào Neon Database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form 1: Cào 1 phim */}
          <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎯</span> Cào lẻ 1 bộ phim
            </h2>
            <form onSubmit={handleCrawlSingle} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Nhập Movie Slug từ nguồn
                </label>
                <input
                  type="text"
                  value={singleSlug}
                  onChange={(e) => setSingleSlug(e.target.value)}
                  placeholder="Ví dụ: avatar-dong-chay-cua-nuoc"
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !singleSlug.trim()}
                className="w-full rounded-xl bg-[#00a3ff] py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Đang đồng bộ..." : "Bắt đầu cào phim này"}
              </button>
            </form>
          </div>

          {/* Form 2: Cào theo trang */}
          <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>📚</span> Cào công nghiệp theo Trang (24 phim/trang)
            </h2>
            <form onSubmit={handleCrawlPage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9ca3af]">
                  Chọn số thứ tự Trang (Page)
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white shadow-lg transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading
                  ? "Đang quét danh sách..."
                  : `Cào toàn bộ Trang ${pageNumber}`}
              </button>
            </form>
          </div>
        </div>

        {/* Bảng kết quả đồng bộ theo Trang nếu có */}
        {syncResults &&
          syncResults.results &&
          syncResults.results.length > 0 && (
            <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Kết quả quét danh sách phim</span>
                <span className="text-xs text-[#00a3ff]">
                  Đã cào thành công: {syncResults.totalSynced || 0} phim
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {syncResults.results.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                      item.status === "SUCCESS"
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-red-500/20 bg-red-500/10 text-red-300"
                    }`}
                  >
                    <span className="truncate max-w-[200px] font-medium">
                      {item.title || item.slug}
                    </span>
                    <span className="font-bold shrink-0">
                      {item.status === "SUCCESS" ? "✓ OK" : "✕ Lỗi"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Khung Console Nhật ký Realtime */}
        <div className="rounded-2xl bg-black/90 border border-white/10 p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#00a3ff] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Crawler Console Output
            </span>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-[11px] text-[#64748b] hover:text-white transition cursor-pointer"
            >
              Xóa log
            </button>
          </div>

          <div className="h-48 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar text-xs">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes("✓")
                      ? "text-green-400"
                      : log.includes("✕")
                        ? "text-red-400"
                        : "text-[#cbd5e1]"
                  }
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="text-[#64748b] italic">
                Chưa có thao tác nào. Hãy nhập slug hoặc chọn trang để chạy bot.
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default AdminCrawlerPage;
