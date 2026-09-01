import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, Filter, Trash2, XCircle } from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { ReportTicket } from "../../../services/adminService";

export const ReportTicketsTab: React.FC = () => {
  // 1. Quản lý State của Tab
  const [tickets, setTickets] = useState<ReportTicket[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "RESOLVED"
  >("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hàm hiển thị thông báo Toast nhanh
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 2. Fetch danh sách báo lỗi khi component mount
  useEffect(() => {
    let isMounted = true;

    const loadTickets = async () => {
      try {
        const data = await adminService.getReportTickets();
        if (isMounted) {
          setTickets(data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách báo lỗi:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Xử lý cập nhật trạng thái Ticket (Đã sửa / Bỏ qua)
  const handleUpdateStatus = async (
    ticketId: number,
    newStatus: "RESOLVED" | "REJECTED",
  ) => {
    await adminService.updateReportStatus(ticketId, newStatus);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)),
    );
    showToast(
      newStatus === "RESOLVED"
        ? "✓ Đã đánh dấu sửa xong sự cố!"
        : "✕ Đã từ chối / bỏ qua báo lỗi!",
    );
  };

  // 4. Xử lý xóa vĩnh viễn Ticket
  const handleDeleteTicket = async (ticketId: number) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa bản ghi báo lỗi này khỏi hệ thống?",
      )
    )
      return;
    await adminService.deleteReportTicket(ticketId);
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    showToast("✓ Đã xóa ticket báo lỗi!");
  };

  // 5. Lọc danh sách hiển thị theo bộ lọc đang chọn
  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === "ALL") return true;
    return t.status === filterStatus;
  });

  // Helper hàm render Badge màu sắc cho từng loại sự cố
  const getIssueBadge = (type: ReportTicket["issue_type"]) => {
    switch (type) {
      case "BROKEN_LINK":
        return (
          <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-400">
            Link Chết / 404
          </span>
        );
      case "WRONG_EPISODE":
        return (
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400">
            Nhầm Tập Phim
          </span>
        );
      case "NO_SOUND":
        return (
          <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-400">
            Mất Âm Thanh
          </span>
        );
      default:
        return (
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-[#00a3ff]">
            Khác
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header & Thanh Bộ Lọc Trạng Thái */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-5 backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚩</span> Hộp Thư Báo Lỗi Tập Phim
          </h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Tổng cộng: {tickets.length} ticket (
            {tickets.filter((t) => t.status === "PENDING").length} đang chờ xử
            lý)
          </p>
        </div>

        {/* Nút lọc nhanh */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#9ca3af]" />
          {(["ALL", "PENDING", "RESOLVED"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`min-h-[38px] rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                filterStatus === st
                  ? "bg-[#00a3ff] text-white shadow-md"
                  : "bg-[#0f172a] text-[#9ca3af] hover:bg-white/5 hover:text-white"
              }`}
            >
              {st === "ALL"
                ? "Tất Cả"
                : st === "PENDING"
                  ? "Chờ Xử Lý"
                  : "Đã Khắc Phục"}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng Danh Sách Ticket */}
      <div className="rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-6 backdrop-blur-xl space-y-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-[#0f172a] text-[#64748b]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Bộ Phim & Tập</th>
                <th className="p-3.5">Loại Lỗi</th>
                <th className="p-3.5">Mô Tả Chi Tiết</th>
                <th className="p-3.5">Thời Gian</th>
                <th className="p-3.5">Trạng Thái</th>
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
                    Đang tải danh sách báo lỗi...
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition">
                    <td className="p-3.5 font-bold text-white">
                      <div className="truncate max-w-[200px]">
                        {t.movie_title}
                      </div>
                      <div className="text-[11px] font-normal text-[#9ca3af]">
                        Tập {t.episode_number} • {t.server_name || "Mặc định"}
                      </div>
                    </td>
                    <td className="p-3.5">{getIssueBadge(t.issue_type)}</td>
                    <td className="p-3.5 text-[#9ca3af] max-w-xs truncate">
                      {t.description || "Không có mô tả chi tiết."}
                    </td>
                    <td className="p-3.5 text-[11px] text-[#64748b] whitespace-nowrap">
                      {new Date(t.created_at).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {new Date(t.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {t.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                          <Clock className="h-3.5 w-3.5" /> Chờ duyệt
                        </span>
                      ) : t.status === "RESOLVED" ? (
                        <span className="inline-flex items-center gap-1 text-green-400 font-bold text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Đã sửa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-bold text-[11px]">
                          <XCircle className="h-3.5 w-3.5" /> Đã bỏ qua
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      {t.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(t.id, "RESOLVED")}
                            className="rounded-lg bg-green-500/10 px-2.5 py-1 text-[11px] font-bold text-green-400 hover:bg-green-500/20 transition cursor-pointer"
                          >
                            Đã Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(t.id, "REJECTED")}
                            className="rounded-lg bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                          >
                            Bỏ Qua
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteTicket(t.id)}
                        className="p-1 text-[#64748b] hover:text-red-400 transition cursor-pointer inline-block"
                        title="Xóa ticket"
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
                    Không có báo lỗi nào ở trạng thái này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportTicketsTab;
