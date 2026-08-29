import React, { useState } from "react";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminTabType } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { OverviewTab } from "../../components/admin/tabs/OverviewTab";
import { CrawlerTab } from "../../components/admin/tabs/CrawlerTab";
import { ServerManagerTab } from "../../components/admin/tabs/ServerManagerTab";

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>("OVERVIEW");

  const tabTitles: Record<AdminTabType, string> = {
    OVERVIEW: "📊 Bảng Điều Khiển Tổng Quan",
    CRAWLER: "🕷️ Công Cụ Cào & Đồng Bộ Phim",
    SERVERS: "📺 Quản Lý Video Server & Nguồn Phát",
    MOVIES: "🎬 Quản Lý Danh Sách Phim & Tập",
    REPORTS: "🚩 Danh Sách Báo Lỗi Từ Khán Giả",
    USERS: "👥 Quản Lý Thành Viên & Phân Quyền",
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans flex">
      {/* Sidebar Điều Hướng */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole="ADMIN"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={tabTitles[activeTab]} />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "OVERVIEW" && <OverviewTab />}
          {activeTab === "CRAWLER" && <CrawlerTab />}
          {activeTab === "SERVERS" && <ServerManagerTab />}
          {activeTab === "MOVIES" && (
            <div className="text-xs text-[#64748b] italic">
              Phân hệ Quản lý Phim & Tập đang được tải...
            </div>
          )}
          {activeTab === "REPORTS" && (
            <div className="text-xs text-[#64748b] italic">
              Hộp thư Báo lỗi tập phim đang được đồng bộ...
            </div>
          )}
          {activeTab === "USERS" && (
            <div className="text-xs text-[#64748b] italic">
              Phân hệ Quản lý User (Cấp quyền Moderator) đang mở...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
