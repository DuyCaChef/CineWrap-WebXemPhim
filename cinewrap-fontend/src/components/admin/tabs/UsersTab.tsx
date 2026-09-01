import React, { useEffect, useState } from "react";
import {
  Ban,
  CheckCircle,
  Filter,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { adminService } from "../../../services/adminService";
import type {
  AdminUserItem,
  UserAccountStatus,
  UserRole,
} from "../../../services/adminService";

export const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | UserAccountStatus>(
    "ALL",
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Tải danh sách người dùng khi mount (xử lý an toàn với isMounted)
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsersList();
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách người dùng:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cập nhật vai trò người dùng (Optimistic UI)
  const handleChangeRole = async (userId: number, newRole: UserRole) => {
    await adminService.updateUserRole(userId, newRole);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
    showToast(`✓ Đã cập nhật quyền thành: ${newRole}`);
  };

  // 3. Khóa hoặc Mở khóa tài khoản
  const handleToggleStatus = async (user: AdminUserItem) => {
    const nextStatus: UserAccountStatus =
      user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    const confirmMsg =
      nextStatus === "BANNED"
        ? `Bạn có chắc chắn muốn KHÓA tài khoản "${user.username}"?`
        : `Mở khóa cho tài khoản "${user.username}"?`;

    if (!window.confirm(confirmMsg)) return;

    await adminService.updateUserStatus(user.id, nextStatus);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)),
    );
    showToast(
      nextStatus === "BANNED"
        ? `✕ Đã khóa tài khoản ${user.username}`
        : `✓ Đã mở khóa cho ${user.username}`,
    );
  };

  // 4. Xóa vĩnh viễn tài khoản
  const handleDeleteUser = async (user: AdminUserItem) => {
    if (user.role === "ADMIN") {
      alert("Không thể xóa tài khoản Quản trị viên cấp cao!");
      return;
    }

    if (!window.confirm(`Xóa vĩnh viễn tài khoản "${user.username}"?`)) return;

    await adminService.deleteUser(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    showToast(`✓ Đã xóa tài khoản ${user.username}`);
  };

  // 5. Lọc danh sách người dùng
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Helper hiển thị Role Badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-400">
            <ShieldAlert className="h-3.5 w-3.5" /> ADMIN
          </span>
        );
      case "MODERATOR":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#00a3ff]/10 px-2.5 py-1 text-[11px] font-bold text-[#00a3ff]">
            <ShieldCheck className="h-3.5 w-3.5" /> MODERATOR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-bold text-[#9ca3af]">
            <User className="h-3.5 w-3.5" /> THÀNH VIÊN
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 rounded-xl bg-[#00a3ff] px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header & Controls Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        {/* Tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748b]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Username hoặc Email..."
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748b] focus:border-[#00a3ff] focus:outline-none min-h-[42px]"
          />
        </div>

        {/* Cụm Bộ Lọc Vai trò & Trạng thái */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Lọc Role */}
          <div className="flex items-center gap-1.5 rounded-xl bg-[#0f172a] p-1 border border-white/10">
            <Filter className="h-3.5 w-3.5 text-[#64748b] ml-1.5" />
            {(["ALL", "ADMIN", "MODERATOR", "USER"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  roleFilter === r
                    ? "bg-[#00a3ff] text-white shadow-md"
                    : "text-[#9ca3af] hover:text-white"
                }`}
              >
                {r === "ALL" ? "Tất Cả" : r}
              </button>
            ))}
          </div>

          {/* Lọc Status */}
          <div className="flex rounded-xl bg-[#0f172a] p-1 border border-white/10">
            {(["ALL", "ACTIVE", "BANNED"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  statusFilter === s
                    ? "bg-[#00a3ff] text-white shadow-md"
                    : "text-[#9ca3af] hover:text-white"
                }`}
              >
                {s === "ALL"
                  ? "Mọi Trạng Thái"
                  : s === "ACTIVE"
                    ? "Hoạt Động"
                    : "Bị Khóa"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bảng Danh Sách Người Dùng */}
      <div className="rounded-2xl border border-white/10 bg-[#131c2e]/80 p-4 sm:p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00a3ff]" />
            <span>Danh Sách Thành Viên & Phân Quyền</span>
          </h3>
          <span className="text-xs text-[#9ca3af]">
            Hiển thị:{" "}
            <strong className="text-white">{filteredUsers.length}</strong> người
            dùng
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead className="bg-[#0f172a] text-[#64748b]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Thành Viên</th>
                <th className="p-3.5">Vai Trò Hiện Tại</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Ngày Tham Gia</th>
                <th className="p-3.5">Phân Quyền Nhanh</th>
                <th className="p-3.5 text-right rounded-r-xl">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#cbd5e1]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-[#64748b] italic"
                  >
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition">
                    {/* Cột User Info */}
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00a3ff]/20 text-xs font-bold text-[#00a3ff] border border-[#00a3ff]/30">
                        {u.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate max-w-xs">
                          {u.username}
                        </p>
                        <p className="text-[11px] text-[#64748b] truncate max-w-xs">
                          {u.email}
                        </p>
                      </div>
                    </td>

                    {/* Cột Role */}
                    <td className="p-3.5">{getRoleBadge(u.role)}</td>

                    {/* Cột Status */}
                    <td className="p-3.5">
                      {u.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5 text-[11px] font-bold text-green-400">
                          <CheckCircle className="h-3 w-3" /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-400">
                          <Ban className="h-3 w-3" /> Bị Khóa
                        </span>
                      )}
                    </td>

                    {/* Cột Ngày tham gia */}
                    <td className="p-3.5 text-[#9ca3af] whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Cột Phân quyền nhanh (Select Dropdown) */}
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        disabled={u.username === "admin_cinewrap"}
                        onChange={(e) =>
                          handleChangeRole(u.id, e.target.value as UserRole)
                        }
                        className="rounded-lg border border-white/10 bg-[#0f172a] px-2.5 py-1 text-xs font-semibold text-white focus:border-[#00a3ff] focus:outline-none disabled:opacity-40 cursor-pointer"
                      >
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    {/* Cột Thao tác */}
                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={u.username === "admin_cinewrap"}
                        onClick={() => handleToggleStatus(u)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer disabled:opacity-30 ${
                          u.status === "ACTIVE"
                            ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        }`}
                        title={
                          u.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"
                        }
                      >
                        {u.status === "ACTIVE" ? "Khóa" : "Mở"}
                      </button>

                      <button
                        type="button"
                        disabled={u.username === "admin_cinewrap"}
                        onClick={() => handleDeleteUser(u)}
                        className="p-1 text-[#64748b] hover:text-red-400 transition cursor-pointer inline-block disabled:opacity-30"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-[#64748b] italic"
                  >
                    Không tìm thấy thành viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
