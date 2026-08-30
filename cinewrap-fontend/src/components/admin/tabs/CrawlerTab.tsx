import React, { useState } from "react";
import { adminService } from "../../../services/adminService";
import type { CrawlPageResponse } from "../../../services/adminService";

export const CrawlerTab: React.FC = () => {
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

  const handleCrawlPage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setSyncResults(null);
      addLog(`Bắt đầu quét danh sách phim tại Trang ${pageNumber}...`);
      const res = await adminService.crawlEntirePage(pageNumber);
      setSyncResults(res);
      addLog(
        `✓ Hoàn thành trang ${pageNumber}: Đồng bộ thành công ${res.totalSynced || 0} phim.`,
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-white">
            <span>🎯</span> Cào Lẻ Theo Movie Slug
          </h2>
          <form onSubmit={handleCrawlSingle} className="space-y-4">
            <input
              type="text"
              value={singleSlug}
              onChange={(e) => setSingleSlug(e.target.value)}
              placeholder="Ví dụ: avatar-dong-chay-cua-nuoc"
              className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] transition focus:border-[#00a3ff] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !singleSlug.trim()}
              className="min-h-[44px] w-full rounded-xl bg-[#00a3ff] py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Đang đồng bộ..." : "Bắt đầu cào phim"}
            </button>
          </form>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-white">
            <span>📚</span> Cào Hàng Loạt Theo Trang (24 phim/trang)
          </h2>
          <form onSubmit={handleCrawlPage} className="space-y-4">
            <input
              type="number"
              min={1}
              max={500}
              value={pageNumber}
              onChange={(e) => setPageNumber(Number(e.target.value))}
              className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] transition focus:border-[#00a3ff] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[44px] w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-purple-500 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Đang quét..." : `Cào Toàn Bộ Trang ${pageNumber}`}
            </button>
          </form>
        </div>
      </div>

      {syncResults?.results && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-5">
          <h3 className="flex items-center justify-between gap-2 text-xs font-bold text-white">
            <span>Kết quả cào gần nhất</span>
            <span className="text-[#00a3ff]">
              Đã cào: {syncResults.totalSynced} phim
            </span>
          </h3>
          <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto pr-1 custom-scrollbar sm:grid-cols-3">
            {syncResults.results.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-xl border p-2 text-xs ${
                  item.status === "SUCCESS"
                    ? "border-green-500/20 bg-green-500/10 text-green-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                <span className="max-w-[150px] truncate">
                  {item.title || item.slug}
                </span>
                <span className="font-bold">
                  {item.status === "SUCCESS" ? "✓" : "✕"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 rounded-2xl border border-white/10 bg-black/90 p-4 font-mono text-[11px] sm:text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 font-bold text-[#00a3ff]">
          <span>Crawler Console Output</span>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="cursor-pointer text-[#64748b] hover:text-white"
          >
            Xóa log
          </button>
        </div>
        <div className="h-40 overflow-y-auto space-y-1 custom-scrollbar sm:h-52">
          {logs.map((log, i) => (
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
          ))}
          {logs.length === 0 && (
            <span className="text-[#64748b] italic">Chưa có log thao tác.</span>
          )}
        </div>
      </div>
    </div>
  );
};
