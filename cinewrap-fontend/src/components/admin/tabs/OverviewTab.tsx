import React from "react";
import {
  Clapperboard,
  Eye,
  Flag,
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
  }> = [
    {
      label: "Tổng số phim",
      value: "1,248",
      icon: Clapperboard,
      change: "+12 tuần này",
    },
    {
      label: "Tổng lượt xem",
      value: "482.9K",
      icon: Eye,
      change: "+18.4%",
    },
    {
      label: "Số lượng tập phim",
      value: "8,920",
      icon: Tv,
      change: "+45 tập mới",
    },
    {
      label: "Báo lỗi chưa duyệt",
      value: "3",
      icon: Flag,
      change: "Cần xử lý ngay",
      alert: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#9ca3af]">
                  {kpi.label}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00a3ff]/10">
                  <Icon className="h-4 w-4 text-[#00a3ff]" strokeWidth={2.2} />
                </div>
              </div>

              <div className="mt-4 text-2xl font-black text-white">
                {kpi.value}
              </div>
              <div
                className={`mt-2 text-[11px] font-bold ${
                  kpi.alert ? "text-red-400" : "text-green-400"
                }`}
              >
                {kpi.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <TrendingUp className="h-4 w-4 text-[#ffc107]" strokeWidth={2.2} />
          Top Phim Xem Nhiều Nhất
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-[550px] w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[#64748b]">
              <tr>
                <th className="pb-3">Tên Phim</th>
                <th className="pb-3">Định Dạng</th>
                <th className="pb-3">Lượt Xem</th>
                <th className="pb-3">Đánh Giá</th>
                <th className="pb-3 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
              <tr>
                <td className="py-3 font-bold text-white">
                  Avatar: Dòng Chảy Của Nước
                </td>
                <td className="py-3">Phim Lẻ</td>
                <td className="py-3 font-mono">124,500</td>
                <td className="py-3 text-[#ffc107]">★ 9.2</td>
                <td className="py-3 text-right font-bold text-green-400">
                  PUBLISHED
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-white">
                  Đấu Phá Thương Khung (Phần 5)
                </td>
                <td className="py-3">Phim Bộ</td>
                <td className="py-3 font-mono">98,200</td>
                <td className="py-3 text-[#ffc107]">★ 8.8</td>
                <td className="py-3 text-right font-bold text-green-400">
                  PUBLISHED
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
