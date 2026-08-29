import React from "react";

export const OverviewTab: React.FC = () => {
  const kpis = [
    {
      label: "Tổng số phim",
      value: "1,248",
      icon: "🎬",
      change: "+12 tuần này",
    },
    { label: "Tổng lượt xem", value: "482.9K", icon: "👁️", change: "+18.4%" },
    {
      label: "Số lượng tập phim",
      value: "8,920",
      icon: "📺",
      change: "+45 tập mới",
    },
    {
      label: "Báo lỗi chưa duyệt",
      value: "3",
      icon: "🚩",
      change: "Cần xử lý ngay",
      alert: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9ca3af]">
                {kpi.label}
              </span>
              <span className="text-xl">{kpi.icon}</span>
            </div>
            <div className="text-2xl font-black text-white">{kpi.value}</div>
            <div
              className={`text-[11px] font-bold ${kpi.alert ? "text-red-400" : "text-green-400"}`}
            >
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Mock Table Top Phim Thịnh Hành */}
      <div className="rounded-2xl bg-[#131c2e]/80 border border-white/10 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>🔥</span> Top Phim Xem Nhiều Nhất
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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
                <td className="py-3 text-right text-green-400 font-bold">
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
                <td className="py-3 text-right text-green-400 font-bold">
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
