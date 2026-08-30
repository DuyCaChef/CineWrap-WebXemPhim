import React from "react";
import {
  BarChart3,
  Bot,
  Flag,
  Film,
  Tv,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import logoCineWrap from "../../assets/images/logo_CineWrap.png";
import Typo_CineWrap from "../../assets/images/Typo_CineWrap.png";

export type AdminTabType =
  | "OVERVIEW"
  | "CRAWLER"
  | "SERVERS"
  | "MOVIES"
  | "REPORTS"
  | "USERS";

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  userRole?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole = "ADMIN",
  isOpen,
  onClose,
}) => {
  const menuItems: Array<{
    id: AdminTabType;
    label: string;
    icon: LucideIcon;
    adminOnly?: boolean;
  }> = [
    { id: "OVERVIEW", label: "Tổng quan & Thống kê", icon: BarChart3 },
    { id: "CRAWLER", label: "Bot Cào Phim", icon: Bot },
    { id: "SERVERS", label: "Quản lý Video Server", icon: Tv },
    { id: "MOVIES", label: "Quản lý Phim & Tập", icon: Film },
    { id: "REPORTS", label: "Báo lỗi tập phim", icon: Flag },
    { id: "USERS", label: "Quản lý Người dùng", icon: Users, adminOnly: true },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 bg-[#0d1425] p-5 transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-15 w-15 items-center justify-center overflow-hidden  ">
              <img
                src={logoCineWrap}
                alt="CineWrap logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <img
                src={Typo_CineWrap}
                alt="CineWrap"
                className="h-5 w-auto max-w-30 object-contain drop-shadow-[0_0_10px_rgba(0,163,255,0.2)]"
              />
              <span className="mt-1.5 block rounded-md bg-[#00a3ff]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#00a3ff]">
                {userRole} Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng menu"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#9ca3af] transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            if (item.adminOnly && userRole !== "ADMIN") return null;
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition cursor-pointer min-h-11 ${
                  isActive
                    ? "bg-[#00a3ff] text-white shadow-[0_0_20px_rgba(0,163,255,0.4)]"
                    : "text-[#9ca3af] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-white" : "text-[#9ca3af]"
                  }`}
                  strokeWidth={2.2}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 px-2 pt-4 text-[11px] text-[#64748b]">
        CineWrap Admin CMS v1.0
      </div>
    </aside>
  );
};

export default AdminSidebar;
