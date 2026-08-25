import React, { useState } from "react";

export interface ReportPayload {
  reason: string;
  description?: string;
}

interface ReportModalProps {
  isOpen: boolean;
  movieTitle: string;
  episodeNumber: number;
  serverName?: string;
  onClose: () => void;
  onSubmit: (data: ReportPayload) => Promise<void>;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  movieTitle,
  episodeNumber,
  serverName,
  onClose,
  onSubmit,
}) => {
  const [reportReason, setReportReason] = useState<string>("DEAD_LINK");
  const [reportDescription, setReportDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit({
        reason: reportReason,
        description: reportDescription.trim() || undefined,
      });
      setReportDescription("");
      setReportReason("DEAD_LINK");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#131c2e] border border-white/10 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚩</span> Báo Lỗi Tập Phim
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9ca3af] hover:text-white transition cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs text-[#9ca3af]">
              Bộ phim:{" "}
              <span className="text-white font-semibold">{movieTitle}</span> -{" "}
              <span className="text-[#00a3ff]">Tập {episodeNumber}</span>
            </p>
            {serverName && (
              <p className="text-xs text-[#9ca3af]">
                Máy chủ hiện tại:{" "}
                <span className="text-white font-medium">{serverName}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#9ca3af]">
              Loại sự cố gặp phải <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "DEAD_LINK", label: "🚫 Chết link / Không phát" },
                { value: "NO_AUDIO", label: "🔇 Mất tiếng / Rè âm" },
                { value: "SUB_ERROR", label: "📝 Lệch / Mất phụ đề" },
                { value: "LAG_BUFFER", label: "⏳ Giật lag / Buffering" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setReportReason(item.value)}
                  className={`rounded-xl border p-2.5 text-xs font-bold text-left transition cursor-pointer ${
                    reportReason === item.value
                      ? "border-[#00a3ff] bg-[#00a3ff]/20 text-[#00a3ff]"
                      : "border-white/10 bg-[#0f172a] text-[#9ca3af] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#9ca3af]">
              Mô tả chi tiết (không bắt buộc)
            </label>
            <textarea
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Ví dụ: Bị đứng hình từ phút 05:20..."
              className="w-full rounded-xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none transition resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 py-2.5 text-xs font-bold text-white shadow-lg transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi Báo Lỗi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
