import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  Film,
  Flag,
  Globe,
  Menu,
  ShieldCheck,
  Tv,
  Users,
  type LucideIcon,
} from "lucide-react";

interface AdminHeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

const headerIconMap: Record<string, LucideIcon> = {
  "Bảng Điều Khiển Tổng Quan": BarChart3,
  "Công Cụ Cào & Đồng Bộ Phim": Bot,
  "Quản Lý Video Server & Nguồn Phát": Tv,
  "Quản Lý Danh Sách Phim & Tập": Film,
  "Danh Sách Báo Lỗi Từ Khán Giả": Flag,
  "Quản Lý Thành Viên & Phân Quyền": Users,
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const TitleIcon = headerIconMap[title] ?? BarChart3;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-[#131c2e]/60 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Mở menu sidebar"
            onClick={onToggleSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0f172a] text-[#9ca3af] transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <Menu className="h-4 w-4" strokeWidth={2.2} />
          </button>

          <h1 className="flex min-w-0 items-center gap-2 text-sm font-black text-white sm:text-base lg:text-lg">
            <TitleIcon
              className="h-4 w-4 shrink-0 text-[#00a3ff] sm:h-5 sm:w-5"
              strokeWidth={2.2}
            />
            <span className="truncate max-w-[180px] sm:max-w-none">
              {title}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2 text-xs font-bold text-[#9ca3af] transition hover:bg-white/5 hover:text-white sm:flex"
          >
            <Globe className="h-3.5 w-3.5 text-[#00a3ff]" strokeWidth={2.4} />
            <span>Xem Trang Chủ</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/home")}
            aria-label="Xem Trang Chủ"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0f172a] text-[#9ca3af] transition hover:bg-white/5 hover:text-white sm:hidden"
          >
            <Globe className="h-4 w-4 text-[#00a3ff]" strokeWidth={2.4} />
          </button>

          <div className="hidden items-center gap-3 border-l border-white/10 pl-2 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00a3ff]/40 bg-[#00a3ff]/20 text-[#00a3ff]">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white leading-tight">
                Quản Trị Viên
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium text-green-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                Đang trực tuyến
              </p>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00a3ff]/40 bg-[#00a3ff]/20 text-[#00a3ff]">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
