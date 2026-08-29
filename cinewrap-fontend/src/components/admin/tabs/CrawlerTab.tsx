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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🎯</span> Cào Lẻ Theo Movie Slug
          </h2>
          <form onSubmit={handleCrawlSingle} className="space-y-4">
            <input
              type="text"
              value={singleSlug}
              onChange={(e) => setSingleSlug(e.target.value)}
              placeholder="Ví dụ: avatar-dong-chay-cua-nuoc"
              className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={isLoading || !singleSlug.trim()}
              className="w-full rounded-xl bg-[#00a3ff] py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Đang đồng bộ..." : "Bắt đầu cào phim"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>📚</span> Cào Hàng Loạt Theo Trang (24 phim/trang)
          </h2>
          <form onSubmit={handleCrawlPage} className="space-y-4">
            <input
              type="number"
              min={1}
              max={500}
              value={pageNumber}
              onChange={(e) => setPageNumber(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white shadow-lg transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Đang quét..." : `Cào Toàn Bộ Trang ${pageNumber}`}
            </button>
          </form>
        </div>
      </div>

      {syncResults?.results && (
        <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-5 space-y-3">
          <h3 className="text-xs font-bold text-white flex justify-between">
            <span>Kết quả cào gần nhất</span>
            <span className="text-[#00a3ff]">
              Đã cào: {syncResults.totalSynced} phim
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {syncResults.results.map((item, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl text-xs border flex justify-between ${
                  item.status === "SUCCESS"
                    ? "border-green-500/20 bg-green-500/10 text-green-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                <span className="truncate max-w-[150px]">
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

      {/* Output Log */}
      <div className="rounded-2xl bg-black/90 border border-white/10 p-4 font-mono text-xs space-y-2">
        <div className="flex justify-between border-b border-white/10 pb-2 text-[#00a3ff] font-bold">
          <span>Crawler Console Output</span>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="text-[#64748b] hover:text-white cursor-pointer"
          >
            Xóa log
          </button>
        </div>
        <div className="h-40 overflow-y-auto space-y-1 custom-scrollbar">
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
