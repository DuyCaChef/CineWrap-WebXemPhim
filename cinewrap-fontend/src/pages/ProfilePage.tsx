import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

// ─── ICONS SYSTEM (NÂNG CẤP CINEMATIC STYLE) ─────────────────────────────────

const ArrowLeftIcon = () => (
  <svg
    className="h-4 w-4 transition-transform group-hover:-translate-x-1"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CameraIcon = () => (
  <svg
    className="h-4 w-4"
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
    className="h-6 w-6 text-cine-primary"
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
    className="h-3.5 w-3.5 text-cine-primary"
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
    className="h-5 w-5"
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
    className="h-5 w-5"
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
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
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
  const accountTier =
    user?.role === "USER" ? "Tài khoản Thường" : user?.role || "Khách";

  // ─── GIAO DIỆN KHI CHƯA ĐĂNG NHẬP (EMPTY STATE) ───────────────────────────
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-cine-bg-primary px-4 pt-24 md:px-8">
        <div className="pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full bg-[#ffc107]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-28 h-96 w-96 rounded-full bg-[#00a3ff]/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-cine-primary/10">
            <ShieldIcon />
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Đăng nhập để xem hồ sơ cá nhân
          </h1>
          <p className="mt-3 text-sm leading-6 text-cine-text-muted md:text-base">
            Quản lý thông tin tài khoản, đổi mật khẩu, theo dõi danh sách phim
            yêu thích và lịch sử xem phim của bạn trên CineWrap.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setAuthOpen(true)}
              className="rounded-full bg-cine-primary px-8 py-3.5 text-sm font-bold text-cine-bg-primary shadow-lg shadow-cine-primary/20 transition-all hover:bg-[#e0a800] hover:scale-105"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-full border border-white/10 bg-white/4 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/10"
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

      const updatedUser =
        response.data?.data ?? response.data?.user ?? response.data;
      if (updatedUser) {
        login(localStorage.getItem("accessToken") || "", updatedUser);
        setSuccess("Cập nhật thông tin hồ sơ thành công!");
        setIsEditMode(false);
        setAvatarFile(null);
      }
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
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

      if (!oldPassword || !newPassword || !confirmPassword) {
        setPasswordError("Vui lòng điền đầy đủ thông tin mật khẩu!");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("Mật khẩu xác nhận không khớp!");
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
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setPasswordError(message || "Mật khẩu hiện tại không chính xác!");
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
    <div className="relative min-h-screen overflow-hidden bg-cine-bg-primary px-4 pb-16 pt-24 md:px-8">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full bg-[#ffc107]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#00a3ff]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[120px_120px] opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.08),transparent_32%),radial-gradient(circle_at_20%_30%,rgba(0,163,255,0.08),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(255,193,7,0.05),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[18%] h-40 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.25),transparent)] blur-2xl" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(10,22,40,0.72)_100%)]" />

      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -36, 0],
          y: [0, 18, 0],
          opacity: [0.35, 0.62, 0.35],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-40 top-10 h-136 w-136 rounded-full bg-[radial-gradient(circle,rgba(255,193,7,0.16)_0%,rgba(255,193,7,0.07)_18%,transparent_68%)] blur-3xl"
      />

      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 28, 0],
          y: [0, -24, 0],
          opacity: [0.28, 0.5, 0.28],
          scale: [1, 1.04, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-40 -bottom-24 h-120 w-120 rounded-full bg-[radial-gradient(circle,rgba(0,163,255,0.15)_0%,rgba(0,163,255,0.06)_20%,transparent_70%)] blur-3xl"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.018)_50%,transparent_100%)] opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.045),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_18%)] opacity-40" />

      <div className="relative mx-auto max-w-6xl space-y-6">
        {/* ── 1. HEADER NAV NẰM TRONG CONTAINER ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-cine-text-muted backdrop-blur-xl transition-all hover:border-cine-primary/40 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeftIcon />
            <span>Trang Chủ</span>
          </button>

          <span className="rounded-full border border-cine-primary/30 bg-cine-primary/10 px-3.5 py-1 text-xs font-bold text-cine-primary">
            Hồ Sơ Cá Nhân
          </span>
        </div>

        {/* ── 2. LAYOUT GRID 2 CỘT CINEMATIC ── */}
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* 👈 CỘT TRÁI: AVATAR CARD & QUICK LINKS ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Thẻ Profile Card */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-black/40">
              {/* Cover Banner Mờ Phía Trên */}
              <div className="relative h-20 bg-linear-to-r from-[#ffc107]/20 via-[#00a3ff]/20 to-transparent">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0a1628]/80" />
              </div>

              <div className="relative px-6 pb-6 -mt-12 text-center">
                {/* Avatar Wrapper */}
                <div className="relative inline-block mx-auto">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-[#ffc107]/40 bg-[#0f172a] text-4xl font-extrabold text-cine-primary shadow-xl shadow-black/50 md:h-32 md:w-32">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>
                        {(fullName || user.email).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-cine-primary text-cine-bg-primary shadow-lg transition-transform hover:scale-110 hover:bg-[#ffce33]"
                    aria-label="Đổi avatar"
                    title="Đổi ảnh đại diện"
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

                <h2 className="mt-4 text-xl font-bold text-white truncate">
                  {fullName || "Thành viên CineWrap"}
                </h2>
                <p className="mt-0.5 text-xs text-cine-text-muted truncate">
                  {user.email}
                </p>

                <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-cine-primary/20 bg-cine-primary/10 px-3.5 py-1 text-xs font-semibold text-cine-primary">
                  <SparkIcon />
                  <span>{accountTier}</span>
                </div>
              </div>

              {/* Thống kê nhanh */}
              <div className="grid grid-cols-3 border-t border-white/10 bg-white/1">
                <div className="px-2 py-3.5 text-center">
                  <p className="text-base font-bold text-[#00a3ff]">
                    {savedMoviesCount}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cine-text-muted">
                    Đã lưu
                  </p>
                </div>
                <div className="border-x border-white/10 px-2 py-3.5 text-center">
                  <p className="text-base font-bold text-cine-primary">
                    {watchedEpisodesCount}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cine-text-muted">
                    Đã xem
                  </p>
                </div>
                <div className="px-2 py-3.5 text-center">
                  <p className="text-base font-bold text-emerald-400">VIP 0</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cine-text-muted">
                    Cấp độ
                  </p>
                </div>
              </div>
            </div>

            {/* Thẻ Thao tác nhanh */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-black/40">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Thao tác nhanh
                </h3>
              </div>

              <div className="grid gap-2.5 p-4">
                <button
                  onClick={() => navigate("/history")}
                  className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/2 p-3 text-left transition-all hover:border-cine-primary/30 hover:bg-white/6"
                >
                  <span className="flex items-center gap-3 text-xs font-semibold text-white">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-cine-primary/10 text-cine-primary group-hover:bg-cine-primary group-hover:text-cine-bg-primary transition-colors">
                      <HistoryIcon />
                    </span>
                    Lịch sử xem phim
                  </span>
                  <span className="text-xs text-cine-text-muted group-hover:text-white">
                    →
                  </span>
                </button>

                <button
                  onClick={() => navigate("/watchlist")}
                  className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/2 p-3 text-left transition-all hover:border-[#00a3ff]/30 hover:bg-white/6"
                >
                  <span className="flex items-center gap-3 text-xs font-semibold text-white">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#00a3ff]/10 text-[#00a3ff] group-hover:bg-[#00a3ff] group-hover:text-[#0f172a] transition-colors">
                      <HeartIcon />
                    </span>
                    Phim đã yêu thích
                  </span>
                  <span className="text-xs text-cine-text-muted group-hover:text-white">
                    →
                  </span>
                </button>
              </div>

              <div className="border-t border-white/10 p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-xs font-bold text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/40"
                >
                  <LogoutIcon />
                  <span>Đăng Xuất Tài Khoản</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* 👉 CỘT PHẢI: FORM CÀI ĐẶT CÁ NHÂN & MẬT KHẨU ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-black/40"
          >
            {/* Header Tabs */}
            <div className="flex gap-2 border-b border-white/10 bg-white/1 p-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 rounded-2xl py-3 text-xs font-bold transition-all ${
                  activeTab === "profile"
                    ? "bg-cine-primary text-cine-bg-primary shadow-lg shadow-cine-primary/20"
                    : "text-cine-text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                Thông tin cá nhân
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 rounded-2xl py-3 text-xs font-bold transition-all ${
                  activeTab === "password"
                    ? "bg-[#00a3ff] text-[#0f172a] shadow-lg shadow-[#00a3ff]/20"
                    : "text-cine-text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                Bảo mật & Mật khẩu
              </button>
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "profile" ? (
                  <motion.div
                    key="tab-profile"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Thông báo Thành công/Lỗi */}
                    {success && (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
                        {success}
                      </div>
                    )}
                    {error && (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
                        {error}
                      </div>
                    )}

                    {/* Lưới thông tin tài khoản */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs font-medium text-cine-text-muted">
                          Địa chỉ Email (Cố định)
                        </p>
                        <p className="mt-1.5 break-all text-sm font-semibold text-white">
                          {user.email}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs font-medium text-cine-text-muted">
                          Quyền hạn hệ thống
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-cine-primary">
                          {user.role}
                        </p>
                      </div>
                    </div>

                    {/* Khối chỉnh sửa Họ Tên */}
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5 md:p-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">
                            Tên hiển thị
                          </h3>
                          <p className="mt-0.5 text-xs text-cine-text-muted">
                            Tên sẽ xuất hiện ở góc Header và phần Bình luận
                            phim.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsEditMode((prev) => !prev)}
                          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                            isEditMode
                              ? "bg-white/10 text-white hover:bg-white/20"
                              : "bg-cine-primary text-cine-bg-primary hover:bg-[#e0a800]"
                          }`}
                        >
                          {isEditMode ? "Hủy bỏ" : "Chỉnh sửa"}
                        </button>
                      </div>

                      {isEditMode ? (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-cine-text-muted">
                              Họ và tên mới
                            </label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all focus:border-cine-primary focus:bg-white/10"
                              placeholder="Nhập họ và tên..."
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={handleSaveProfile}
                              disabled={isUpdating}
                              className="flex-1 rounded-2xl bg-cine-primary px-4 py-3 text-xs font-bold text-cine-bg-primary transition-all hover:bg-[#e0a800] disabled:opacity-50"
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
                              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-white/10"
                            >
                              Đóng
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/5 bg-white/2 p-4">
                          <p className="text-sm font-semibold text-white">
                            {fullName || "Chưa cập nhật tên hiển thị"}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-password"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Thiết lập mật khẩu
                      </h3>
                      <p className="mt-1 text-xs text-cine-text-muted">
                        Nên sử dụng mật khẩu dài từ 6 ký tự gồm chữ cái và số để
                        đảm bảo an toàn.
                      </p>
                    </div>

                    {/* Thông báo lỗi Mật khẩu */}
                    {passwordError && (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
                        {passwordSuccess}
                      </div>
                    )}

                    <div className="space-y-4 pt-2">
                      {/* Mật khẩu hiện tại */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-cine-text-muted">
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <input
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white outline-none transition-all focus:border-[#00a3ff] focus:bg-white/10"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword((prev) => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cine-text-muted hover:text-white transition-colors"
                          >
                            {showOldPassword ? (
                              <EyeOpenIcon />
                            ) : (
                              <EyeClosedIcon />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Mật khẩu mới & Xác nhận */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-cine-text-muted">
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white outline-none transition-all focus:border-[#00a3ff] focus:bg-white/10"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword((prev) => !prev)
                              }
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cine-text-muted hover:text-white transition-colors"
                            >
                              {showNewPassword ? (
                                <EyeOpenIcon />
                              ) : (
                                <EyeClosedIcon />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-cine-text-muted">
                            Xác nhận mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white outline-none transition-all focus:border-[#00a3ff] focus:bg-white/10"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cine-text-muted hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOpenIcon />
                              ) : (
                                <EyeClosedIcon />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleChangePassword}
                        disabled={isUpdating}
                        className="mt-2 h-11 w-full rounded-2xl bg-[#00a3ff] text-xs font-bold text-[#0f172a] shadow-lg shadow-[#00a3ff]/20 transition-all hover:bg-[#33b5ff] disabled:opacity-50"
                      >
                        {isUpdating ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
