import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  Tv,
  Film,
  Flag,
  Users,
  Globe,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface AdminHeaderProps {
  title: string;
}

const headerIconMap: Record<string, LucideIcon> = {
  "Bảng Điều Khiển Tổng Quan": BarChart3,
  "Công Cụ Cào & Đồng Bộ Phim": Bot,
  "Quản Lý Video Server & Nguồn Phát": Tv,
  "Quản Lý Danh Sách Phim & Tập": Film,
  "Danh Sách Báo Lỗi Từ Khán Giả": Flag,
  "Quản Lý Thành Viên & Phân Quyền": Users,
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const TitleIcon = headerIconMap[title] ?? BarChart3;

  return (
    <header className="h-16 border-b border-white/10 bg-[#131c2e]/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2.5">
        <TitleIcon className="h-5 w-5 text-[#00a3ff]" strokeWidth={2.2} />
        <span>{title}</span>
      </h1>

      <div className="flex items-center gap-4">
        {/* Nút quay lại giao diện Web chính */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2 text-xs font-bold text-[#9ca3af] hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-[#00a3ff]" strokeWidth={2.4} />
          <span>Xem Trang Chủ</span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="h-9 w-9 rounded-full bg-[#00a3ff]/20 border border-[#00a3ff]/40 flex items-center justify-center text-sm font-bold text-[#00a3ff]">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white leading-tight">Quản Trị Viên</p>
            <p className="text-[10px] text-green-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
              Đang trực tuyến
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
