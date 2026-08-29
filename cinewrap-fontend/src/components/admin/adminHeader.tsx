import React from "react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-white/10 bg-[#131c2e]/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-lg font-black text-white flex items-center gap-2">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* Nút quay lại giao diện Web chính */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2 text-xs font-bold text-[#9ca3af] hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <span>🌐</span> Xem Trang Chủ
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="h-9 w-9 rounded-full bg-[#00a3ff]/20 border border-[#00a3ff]/40 flex items-center justify-center text-sm font-bold text-[#00a3ff]">
            AD
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">Quản Trị Viên</p>
            <p className="text-[10px] text-green-400 font-medium">
              ● Đang trực tuyến
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
