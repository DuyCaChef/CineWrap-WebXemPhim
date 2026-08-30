import React from "react";
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

export const OverviewTab: React.FC = () => {
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
      value: "1,248",
      icon: Clapperboard,
      change: "+12 tuần này",
      accent: "text-[#7dd3fc]",
      iconBg: "bg-[#00a3ff]/12",
    },
    {
      label: "Tổng lượt xem",
      value: "482.9K",
      icon: Eye,
      change: "+18.4%",
      accent: "text-[#34d399]",
      iconBg: "bg-[#22c55e]/12",
    },
    {
      label: "Số lượng tập phim",
      value: "8,920",
      icon: Tv,
      change: "+45 tập mới",
      accent: "text-[#fbbf24]",
      iconBg: "bg-[#f59e0b]/12",
    },
    {
      label: "Báo lỗi chưa duyệt",
      value: "3",
      icon: Flag,
      change: "Cần xử lý ngay",
      alert: true,
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
      label: 'Phim mới "Cá Chép Trong Nước" đã được xuất bản',
      time: "24 phút trước",
    },
    { label: "3 báo lỗi tập phim đang chờ xác minh", time: "1 giờ trước" },
    {
      label: "Lượt xem hôm nay tăng 8.2% so với tuần trước",
      time: "2 giờ trước",
    },
  ];

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
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

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.9fr)]">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,28,46,0.96),rgba(13,20,37,0.92))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <TrendingUp
                className="h-4 w-4 text-[#ffc107]"
                strokeWidth={2.2}
              />
              Top Phim Xem Nhiều Nhất
            </h3>
            <button
              type="button"
              className="min-h-11 rounded-lg border border-[#00a3ff]/25 bg-[#0f172a] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc] transition hover:border-[#00a3ff]/40 hover:bg-[#12213a]"
            >
              Xem thêm
            </button>
          </div>

          <div className="max-w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-150 text-left text-xs">
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
                <tr className="transition hover:bg-white/3">
                  <td className="whitespace-nowrap py-3 font-bold text-white">
                    Avatar: Dòng Chảy Của Nước
                  </td>
                  <td className="whitespace-nowrap py-3">Phim Lẻ</td>
                  <td className="whitespace-nowrap py-3 font-mono">124,500</td>
                  <td className="whitespace-nowrap py-3 text-[#ffc107]">
                    ★ 9.2
                  </td>
                  <td className="whitespace-nowrap py-3 text-right font-bold text-green-400">
                    PUBLISHED
                  </td>
                </tr>
                <tr className="transition hover:bg-white/3">
                  <td className="whitespace-nowrap py-3 font-bold text-white">
                    Đấu Phá Thương Khung (Phần 5)
                  </td>
                  <td className="whitespace-nowrap py-3">Phim Bộ</td>
                  <td className="whitespace-nowrap py-3 font-mono">98,200</td>
                  <td className="whitespace-nowrap py-3 text-[#ffc107]">
                    ★ 8.8
                  </td>
                  <td className="whitespace-nowrap py-3 text-right font-bold text-green-400">
                    PUBLISHED
                  </td>
                </tr>
                <tr className="transition hover:bg-white/3">
                  <td className="whitespace-nowrap py-3 font-bold text-white">
                    Tiệm Bánh Kỳ Diệu
                  </td>
                  <td className="whitespace-nowrap py-3">Phim Lẻ</td>
                  <td className="whitespace-nowrap py-3 font-mono">76,980</td>
                  <td className="whitespace-nowrap py-3 text-[#ffc107]">
                    ★ 9.0
                  </td>
                  <td className="whitespace-nowrap py-3 text-right font-bold text-amber-400">
                    REVIEW
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,39,0.96),rgba(11,18,28,0.94))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles
                  className="h-4 w-4 text-[#7dd3fc]"
                  strokeWidth={2.2}
                />
                Quick Actions
              </h4>
            </div>

            <div className="space-y-2.5">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/3 px-3 py-2.5 text-left text-xs font-semibold text-[#dfeafc] transition hover:border-[#00a3ff]/30 hover:bg-[#0d1b2d]"
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
                Recent Activity
              </h4>
            </div>

            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.label}
                  className="rounded-xl border border-white/10 bg-white/3 p-2.5"
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
