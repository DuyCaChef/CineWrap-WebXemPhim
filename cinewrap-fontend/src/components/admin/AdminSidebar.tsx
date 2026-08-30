import React from "react";
import {
  BarChart3,
  Bot,
  Flag,
  Film,
  Sparkles,
  Tv,
  Users,
  type LucideIcon,
} from "lucide-react";

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
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole = "ADMIN",
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
    <aside className="w-64 shrink-0 bg-[#0d1425] border-r border-white/10 min-h-screen p-5 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00a3ff] to-[#0066ff] text-xl shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-wider">
              CINEWRAP
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00a3ff] bg-[#00a3ff]/10 px-2 py-0.5 rounded-md">
              {userRole} Portal
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            if (item.adminOnly && userRole !== "ADMIN") return null;
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
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

      {/* Footer Info */}
      <div className="border-t border-white/10 pt-4 px-2 text-[11px] text-[#64748b]">
        CineWrap Admin CMS v1.0
      </div>
    </aside>
  );
};

export default AdminSidebar;
