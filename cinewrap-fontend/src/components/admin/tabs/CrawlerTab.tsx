import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Play,
  RadioTower,
  RotateCcw,
  Terminal,
  Trash2,
  XCircle,
} from "lucide-react";
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
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="group min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,28,46,0.96),rgba(13,20,37,0.92))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:border-[#00a3ff]/40 hover:shadow-[0_20px_45px_rgba(0,163,255,0.12)] sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                <RadioTower
                  className="h-4 w-4 shrink-0 text-[#7dd3fc]"
                  strokeWidth={2.2}
                />
                Cào Lẻ Theo Movie Slug
              </h2>
              <p className="mt-1 text-xs text-[#64748b]">
                Đồng bộ một phim theo định danh slug.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-[#00a3ff]/20 bg-[#00a3ff]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7dd3fc]">
              Single
            </span>
          </div>
          <form onSubmit={handleCrawlSingle} className="space-y-4">
            <input
              type="text"
              value={singleSlug}
              onChange={(e) => setSingleSlug(e.target.value)}
              placeholder="Ví dụ: avatar-dong-chay-cua-nuoc"
              className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] transition focus:border-[#00a3ff] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !singleSlug.trim()}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00a3ff] py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(0,163,255,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <LoaderCircle
                    className="h-4 w-4 animate-spin"
                    strokeWidth={2.2}
                  />
                  Đang đồng bộ...
                </>
              ) : (
                <>
                  <Play
                    className="h-4 w-4"
                    fill="currentColor"
                    strokeWidth={2.2}
                  />
                  Bắt đầu cào phim
                </>
              )}
            </button>
          </form>
        </div>

        <div className="group min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,28,46,0.96),rgba(13,20,37,0.92))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:border-[#ffc107]/35 hover:shadow-[0_20px_45px_rgba(255,193,7,0.08)] sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                <BookOpen
                  className="h-4 w-4 shrink-0 text-[#fbbf24]"
                  strokeWidth={2.2}
                />
                Cào Hàng Loạt Theo Trang
              </h2>
              <p className="mt-1 text-xs text-[#64748b]">
                Quét danh sách phim, 24 phim mỗi trang.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-[#ffc107]/20 bg-[#ffc107]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#fbbf24]">
              Batch
            </span>
          </div>
          <form onSubmit={handleCrawlPage} className="space-y-4">
            <input
              type="number"
              min={1}
              max={500}
              value={pageNumber}
              onChange={(e) => setPageNumber(Number(e.target.value))}
              className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] transition focus:border-[#00a3ff] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc107] py-2.5 text-xs font-bold text-[#111827] shadow-[0_10px_24px_rgba(255,193,7,0.16)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <LoaderCircle
                    className="h-4 w-4 animate-spin"
                    strokeWidth={2.2}
                  />
                  Đang quét...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
                  Cào Toàn Bộ Trang {pageNumber}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {syncResults?.results && (
        <div className="min-w-0 space-y-3 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,39,0.96),rgba(11,18,28,0.94))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-5">
          <h3 className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <CheckCircle2
                className="h-4 w-4 text-[#34d399]"
                strokeWidth={2.2}
              />
              Kết quả cào gần nhất
            </span>
            <span className="text-[#7dd3fc]">
              Đã cào: {syncResults.totalSynced} phim
            </span>
          </h3>
          <div className="grid max-h-40 min-w-0 grid-cols-1 gap-2 overflow-y-auto pr-1 custom-scrollbar sm:grid-cols-2 lg:grid-cols-3">
            {syncResults.results.map((item, idx) => (
              <div
                key={idx}
                className={`flex min-w-0 items-center justify-between gap-2 rounded-xl border p-2.5 text-xs ${
                  item.status === "SUCCESS"
                    ? "border-green-500/20 bg-green-500/10 text-green-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                <span className="min-w-0 truncate">
                  {item.title || item.slug}
                </span>
                {item.status === "SUCCESS" ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    strokeWidth={2.2}
                  />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" strokeWidth={2.2} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="min-w-0 space-y-2 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,22,0.98),rgba(3,7,15,0.98))] p-4 font-mono text-[11px] shadow-[0_12px_30px_rgba(0,0,0,0.22)] sm:text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 font-bold text-[#00a3ff]">
          <span className="flex items-center gap-2">
            <Terminal className="h-4 w-4" strokeWidth={2.2} />
            Crawler Console Output
          </span>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="flex min-h-11 items-center gap-2 rounded-lg px-2.5 text-[11px] font-bold text-[#64748b] transition hover:bg-white/5 hover:text-white cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
            Xóa log
          </button>
        </div>
        <div className="h-40 min-w-0 space-y-1 overflow-y-auto custom-scrollbar sm:h-52">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`wrap-break-word ${
                log.includes("✓")
                  ? "text-green-400"
                  : log.includes("✕")
                    ? "text-red-400"
                    : "text-[#cbd5e1]"
              }`}
            >
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <span className="flex items-center gap-2 text-[#64748b] italic">
              <CircleAlert className="h-3.5 w-3.5" strokeWidth={2} />
              Chưa có log thao tác.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
