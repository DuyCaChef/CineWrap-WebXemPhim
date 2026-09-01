import React, { useState } from "react";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminTabType } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { OverviewTab } from "../../components/admin/tabs/OverviewTab";
import { CrawlerTab } from "../../components/admin/tabs/CrawlerTab";
import { ServerManagerTab } from "../../components/admin/tabs/ServerManagerTab";
import { MoviesTab } from "../../components/admin/tabs/MoviesTab";
import { ReportTicketsTab } from "../../components/admin/tabs/ReportTicketsTab";

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>("OVERVIEW");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const tabTitles: Record<AdminTabType, string> = {
    OVERVIEW: "Bảng Điều Khiển Tổng Quan",
    CRAWLER: "Công Cụ Cào & Đồng Bộ Phim",
    SERVERS: "Quản Lý Video Server & Nguồn Phát",
    MOVIES: "Quản Lý Danh Sách Phim & Tập",
    REPORTS: "Danh Sách Báo Lỗi Từ Khán Giả",
    USERS: "Quản Lý Thành Viên & Phân Quyền",
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans overflow-x-hidden">
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden lg:flex-row">
        {isMobileSidebarOpen && (
          <div
            aria-label="Close mobile sidebar"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar Điều Hướng */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          userRole="ADMIN"
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            title={tabTitles[activeTab]}
            onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
            {activeTab === "OVERVIEW" && <OverviewTab />}
            {activeTab === "CRAWLER" && <CrawlerTab />}
            {activeTab === "SERVERS" && <ServerManagerTab />}
            {activeTab === "MOVIES" && <MoviesTab />}
            {activeTab === "REPORTS" && <ReportTicketsTab />}
            {activeTab === "USERS" && (
              <div className="text-xs text-[#64748b] italic">
                Phân hệ Quản lý User (Cấp quyền Moderator) đang mở...
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
