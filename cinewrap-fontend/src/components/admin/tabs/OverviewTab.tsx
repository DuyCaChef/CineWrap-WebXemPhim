import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Clapperboard,
  Eye,
  Flag,
  Sparkles,
  TrendingUp,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { AdminStatsResponse } from "../../../services/adminService";

export const OverviewTab: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsResponse>({
    totalMovies: 0,
    totalViews: 0,
    totalEpisodes: 0,
    pendingReports: 0,
    topMovies: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu thống kê bảng điều khiển khi component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi tải thống kê tổng quan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpis: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
    change: string;
    alert?: boolean;
    accent: string;
    iconBg: string;
  }> = [
    {
      label: "Tổng số phim",
      value: isLoading ? "..." : stats.totalMovies.toLocaleString("vi-VN"),
      icon: Clapperboard,
      change: "+12 tuần này",
      accent: "text-[#7dd3fc]",
      iconBg: "bg-[#00a3ff]/12",
    },
    {
      label: "Tổng lượt xem",
      value: isLoading ? "..." : `${(stats.totalViews / 1000).toFixed(1)}K`,
      icon: Eye,
      change: "+18.4%",
      accent: "text-[#34d399]",
      iconBg: "bg-[#22c55e]/12",
    },
    {
      label: "Số lượng tập phim",
      value: isLoading ? "..." : stats.totalEpisodes.toLocaleString("vi-VN"),
      icon: Tv,
      change: "+45 tập mới",
      accent: "text-[#fbbf24]",
      iconBg: "bg-[#f59e0b]/12",
    },
    {
      label: "Báo lỗi chưa duyệt",
      value: isLoading ? "..." : String(stats.pendingReports),
      icon: Flag,
      change: stats.pendingReports > 0 ? "Cần xử lý ngay" : "Đã hoàn thành",
      alert: stats.pendingReports > 0,
      accent: "text-[#f87171]",
      iconBg: "bg-[#ef4444]/12",
    },
  ];

  const quickActions = [
    "Tạo phim mới",
    "Cập nhật server",
    "Duyệt báo lỗi",
    "Xuất báo cáo tuần",
  ];

  const activities = [
    {
      label: "Server Stream A đã hoạt động ổn định 99.9%",
      time: "5 phút trước",
    },
    {
      label: 'Phim mới "Avatar: Dòng Chảy Của Nước" đã được xuất bản',
      time: "24 phút trước",
    },
    {
      label: `${stats.pendingReports} báo lỗi tập phim đang chờ xác minh`,
      time: "1 giờ trước",
    },
    {
      label: "Lượt xem hôm nay tăng 8.2% so với tuần trước",
      time: "2 giờ trước",
    },
  ];

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      {/* KPI Cards Grid */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="group min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,28,46,0.96),rgba(13,20,37,0.92))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:border-[#00a3ff]/40 hover:shadow-[0_20px_45px_rgba(0,163,255,0.12)] sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="wrap-break-word text-[11px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                    {kpi.label}
                  </span>
                  <div className="text-3xl font-black tracking-tight text-white">
                    {kpi.value}
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 ${kpi.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${kpi.accent}`} strokeWidth={2.2} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    kpi.alert ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.3} />
                  {kpi.change}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#64748b]">
                  Live
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Top Phim + Side Cards */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.9fr)]">
        {/* Cột trái: Top Phim Xem Nhiều Nhất */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,28,46,0.96),rgba(13,20,37,0.92))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <TrendingUp
                className="h-4 w-4 text-[#ffc107]"
                strokeWidth={2.2}
              />
              Top Phim Xem Nhiều Nhất
            </h3>
            <span className="text-xs text-[#00a3ff] font-semibold">
              Cập nhật theo thời gian thực
            </span>
          </div>

          <div className="max-w-full overflow-x-auto overscroll-x-contain custom-scrollbar">
            <table className="w-full min-w-[550px] text-left text-xs">
              <thead className="border-b border-white/10 text-[#64748b]">
                <tr>
                  <th className="whitespace-nowrap pb-3">Tên Phim</th>
                  <th className="whitespace-nowrap pb-3">Định Dạng</th>
                  <th className="whitespace-nowrap pb-3">Lượt Xem</th>
                  <th className="whitespace-nowrap pb-3">Đánh Giá</th>
                  <th className="whitespace-nowrap pb-3 text-right">
                    Trạng Thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
                {stats.topMovies.map((movie) => (
                  <tr key={movie.id} className="transition hover:bg-white/5">
                    <td className="whitespace-nowrap py-3 font-bold text-white">
                      {movie.title}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-bold text-[#94a3b8]">
                        {movie.type === "SINGLE" ? "Phim Lẻ" : "Phim Bộ"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 font-mono">
                      {movie.view_count.toLocaleString("vi-VN")}
                    </td>
                    <td className="whitespace-nowrap py-3 text-[#ffc107]">
                      ★ {movie.average_rating.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap py-3 text-right font-bold">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] ${
                          movie.status === "PUBLISHED"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {movie.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Quick Actions & Recent Activity */}
        <div className="min-w-0 space-y-6">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,39,0.96),rgba(11,18,28,0.94))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles
                  className="h-4 w-4 text-[#7dd3fc]"
                  strokeWidth={2.2}
                />
                Lối Tắt Nhanh
              </h4>
            </div>

            <div className="space-y-2.5">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-xs font-semibold text-[#dfeafc] transition hover:border-[#00a3ff]/30 hover:bg-[#0d1b2d] cursor-pointer"
                >
                  <span>{action}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-[#7dd3fc]"
                    strokeWidth={2.2}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,39,0.96),rgba(11,18,28,0.94))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                <Activity
                  className="h-4 w-4 text-[#34d399]"
                  strokeWidth={2.2}
                />
                Hoạt Động Gần Đây
              </h4>
            </div>

            <div className="space-y-3">
              {activities.map((activity, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5"
                >
                  <p className="text-xs font-medium text-[#e2e8f0]">
                    {activity.label}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#64748b]">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
