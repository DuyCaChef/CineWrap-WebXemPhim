import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthModal } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 11a4 4 0 1 0-8 0" />
    <path d="M23 11.13V16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SparkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" />
  </svg>
);

const HistoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.8 4.6c-1.5-1.5-3.9-1.5-5.4 0L12 8l-3.4-3.4c-1.5-1.5-3.9-1.5-5.4 0-1.5 1.5-1.5 3.9 0 5.4L12 22l8.8-8.8c1.5-1.5 1.5-3.9 0-5.4z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
    <path d="M21 3v18" />
  </svg>
);

type ProfileTab = "profile" | "password";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const savedMoviesCount = 12;
  const watchedEpisodesCount = 48;
  const accountTier = user?.role === "USER" ? "Thường" : user?.role || "Thường";

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-cine-bg-primary px-4 pt-24 md:px-8">
        <div className="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full bg-[#ffc107]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-28 h-80 w-80 rounded-full bg-[#00a3ff]/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-cine-primary/10 text-cine-primary">
            <ShieldIcon />
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Đăng nhập để xem hồ sơ của bạn</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-cine-text-muted md:text-base">
            Profile của bạn sẽ lưu thông tin cá nhân, mật khẩu, lịch sử xem và danh sách yêu thích.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setAuthOpen(true)}
              className="rounded-full bg-cine-primary px-6 py-3 text-sm font-bold text-cine-bg-primary transition-colors hover:bg-[#e0a800]"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-full border border-white/10 bg-white/3 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/5"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={authOpen}
          initialMode="login"
          onClose={() => setAuthOpen(false)}
          key={authOpen ? "login" : "closed"}
        />
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setAvatar(String(event.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      setError("");
      setSuccess("");
      setIsUpdating(true);

      const formData = new FormData();
      formData.append("full_name", fullName);
      if (avatarFile) formData.append("avatar", avatarFile);

      const response = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data?.data ?? response.data?.user ?? response.data;
      if (updatedUser) {
        login(localStorage.getItem("accessToken") || "", updatedUser);
        setSuccess("Cập nhật thông tin thành công!");
        setIsEditMode(false);
        setAvatarFile(null);
      }
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Lỗi cập nhật thông tin người dùng");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError("");
      setPasswordSuccess("");

      if (newPassword !== confirmPassword) {
        setPasswordError("Mật khẩu mới không khớp!");
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
      }

      setIsUpdating(true);
      await api.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setPasswordSuccess("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setPasswordError(message || "Lỗi đổi mật khẩu");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (logoutError) {
      console.error("Logout failed", logoutError);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cine-bg-primary px-4 pb-12 pt-24 md:px-8">
      <div className="pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full bg-[#ffc107]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#00a3ff]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-black/30">
            <div className="relative px-6 pb-6 pt-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,193,7,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(0,163,255,0.12),transparent_45%)]" />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative shrink-0">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-cine-primary/10 text-5xl font-bold text-cine-primary shadow-lg shadow-cine-primary/10 md:h-32 md:w-32">
                    {avatar ? (
                      <img src={avatar} alt={fullName} className="h-full w-full object-cover" />
                    ) : (
                      <span>{fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#0f172a]/90 text-white shadow-xl shadow-black/30 backdrop-blur-xl transition-transform hover:scale-105 hover:border-cine-primary/60"
                    aria-label="Đổi avatar"
                  >
                    <CameraIcon />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-white">{fullName || "Chưa cập nhật"}</h2>
                <p className="mt-1 text-sm text-cine-text-muted">{user.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cine-primary/20 bg-cine-primary/10 px-3 py-1.5 text-xs font-semibold text-cine-primary">
                  <SparkIcon />
                  {accountTier}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10">
              <div className="px-4 py-4 text-center">
                <p className="text-lg font-bold text-white">{savedMoviesCount}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cine-text-muted">Đã lưu</p>
              </div>
              <div className="border-x border-white/10 px-4 py-4 text-center">
                <p className="text-lg font-bold text-white">{watchedEpisodesCount}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cine-text-muted">Đã xem</p>
              </div>
              <div className="px-4 py-4 text-center">
                <p className="text-lg font-bold text-white">{accountTier}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cine-text-muted">Tài khoản</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-black/30">
            <div className="border-b border-white/10 px-6 py-5">
              <h3 className="text-lg font-semibold text-white">Thao tác nhanh</h3>
              <p className="mt-1 text-sm text-cine-text-muted">Đi tới những khu vực cá nhân thường dùng.</p>
            </div>

            <div className="grid gap-3 p-6">
              <button
                onClick={() => navigate("/history")}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f172a]/50 px-4 py-4 text-left transition-colors hover:border-cine-primary/30 hover:bg-white/5"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-cine-primary/10 text-cine-primary">
                    <HistoryIcon />
                  </span>
                  Lịch sử xem phim
                </span>
                <span className="text-sm text-cine-text-muted">Mở</span>
              </button>

              <button
                onClick={() => navigate("/watchlist")}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f172a]/50 px-4 py-4 text-left transition-colors hover:border-cine-primary/30 hover:bg-white/5"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#00a3ff]/10 text-[#00a3ff]">
                    <HeartIcon />
                  </span>
                  Danh sách phim yêu thích
                </span>
                <span className="text-sm text-cine-text-muted">Mở</span>
              </button>
            </div>

            <div className="border-t border-white/10 p-6">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200"
              >
                <LogoutIcon />
                Đăng xuất
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-black/30"
        >
          <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${activeTab === "profile" ? "bg-cine-primary text-cine-bg-primary" : "text-white hover:bg-white/5"}`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${activeTab === "password" ? "bg-cine-primary text-cine-bg-primary" : "text-white hover:bg-white/5"}`}
            >
              Đổi mật khẩu
            </button>
          </div>

          <div className="p-6 md:p-8">
            {success && (
              <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {activeTab === "profile" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0f172a]/40 p-4">
                    <p className="mb-2 text-sm font-medium text-cine-text-muted">Email</p>
                    <p className="break-all text-white">{user.email}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0f172a]/40 p-4">
                    <p className="mb-2 text-sm font-medium text-cine-text-muted">Loại tài khoản</p>
                    <p className="text-white">{accountTier}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0f172a]/40 p-5 md:p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Thông tin cá nhân</h3>
                      <p className="mt-1 text-sm text-cine-text-muted">Cập nhật tên hiển thị và avatar.</p>
                    </div>
                    <button
                      onClick={() => setIsEditMode((prev) => !prev)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        isEditMode
                          ? "bg-white/8 text-white hover:bg-white/12"
                          : "bg-cine-primary text-cine-bg-primary hover:bg-[#e0a800]"
                      }`}
                    >
                      {isEditMode ? "Đóng chỉnh sửa" : "Chỉnh sửa"}
                    </button>
                  </div>

                  {isEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-cine-text-muted">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-cine-primary"
                          placeholder="Nhập tên của bạn"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={handleSaveProfile}
                          disabled={isUpdating}
                          className="flex-1 rounded-2xl bg-cine-primary px-4 py-3 font-semibold text-cine-bg-primary transition-colors hover:bg-[#e0a800] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                        </motion.button>
                        <button
                          onClick={() => {
                            setIsEditMode(false);
                            setFullName(user.full_name || "");
                            setAvatar(user.avatar || "");
                            setAvatarFile(null);
                          }}
                          className="rounded-2xl border border-white/10 bg-white/3 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/5"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                        <p className="text-sm text-cine-text-muted">Tên hiển thị</p>
                        <p className="mt-2 text-white">{fullName || "Chưa cập nhật"}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                        <p className="text-sm text-cine-text-muted">Avatar</p>
                        <p className="mt-2 text-white">{avatar ? "Đã cập nhật" : "Chưa có avatar"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-[#0f172a]/40 p-5 md:p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Đổi mật khẩu</h3>
                      <p className="mt-1 text-sm text-cine-text-muted">Bảo mật tài khoản bằng mật khẩu mới.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-cine-text-muted">Mật khẩu hiện tại</label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-white outline-none transition-colors placeholder:text-white/30 focus:border-cine-primary"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] transition-colors hover:text-white"
                          aria-label={showOldPassword ? "Ẩn mật khẩu hiện tại" : "Hiện mật khẩu hiện tại"}
                        >
                          {showOldPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-cine-text-muted">Mật khẩu mới</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-white outline-none transition-colors placeholder:text-white/30 focus:border-cine-primary"
                            placeholder="Nhập mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] transition-colors hover:text-white"
                            aria-label={showNewPassword ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}
                          >
                            {showNewPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-cine-text-muted">Xác nhận mật khẩu</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-white outline-none transition-colors placeholder:text-white/30 focus:border-cine-primary"
                            placeholder="Xác nhận mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] transition-colors hover:text-white"
                            aria-label={showConfirmPassword ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"}
                          >
                            {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {passwordError && (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                        {passwordSuccess}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleChangePassword}
                      disabled={isUpdating}
                      className="w-full rounded-2xl bg-cine-primary px-4 py-3 font-semibold text-cine-bg-primary transition-colors hover:bg-[#e0a800] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AuthModal
        isOpen={authOpen}
        initialMode="login"
        onClose={() => setAuthOpen(false)}
        key={authOpen ? "login" : "closed"}
      />
    </div>
  );
};

export default ProfilePage;
