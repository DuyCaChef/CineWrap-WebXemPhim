import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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
    width="20"
    height="20"
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

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isPasswordSection, setIsPasswordSection] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Error states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-cine-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-cine-text-muted mb-4">Vui lòng đăng nhập</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-cine-primary text-cine-bg-primary font-bold rounded-full"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError("");
      setSuccess("");
      setIsLoadingUpdate(true);

      const formData = new FormData();
      formData.append("full_name", fullName);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await api.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.data) {
        const updatedUser = response.data.data;
        login(localStorage.getItem("accessToken") || "", updatedUser);
        setSuccess("Cập nhật thông tin thành công!");
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
      setIsLoadingUpdate(false);
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

      setIsLoadingUpdate(true);

      await api.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setPasswordSuccess("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordSection(false);
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;

      setPasswordError(message || "Lỗi đổi mật khẩu");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return (
    <div className="min-h-screen bg-cine-bg-primary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-bold text-white">Thông Tin Cá Nhân</h1>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
          >
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f172a]/50 border border-white/10 rounded-2xl p-6 md:p-8 mb-6 backdrop-blur-xl"
        >
          <div className="flex items-start gap-6 md:gap-8 mb-8">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-cine-primary/30 bg-cine-primary/10">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-cine-primary">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {isEditMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-cine-primary rounded-lg hover:bg-[#e0a800] transition-colors"
                >
                  <CameraIcon />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cine-text-muted mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-cine-text-muted focus:outline-none focus:border-cine-primary transition-colors"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-cine-text-muted mb-1">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {fullName || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 pb-8 border-b border-white/10">
            <div>
              <p className="text-sm font-medium text-cine-text-muted mb-2">
                Email
              </p>
              <p className="text-white break-all">{user.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-cine-text-muted mb-2">
                Role
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-cine-primary/20 text-cine-primary text-sm font-medium rounded-full">
                  {user.role === "USER" ? "Khách hàng" : user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isEditMode ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditMode(true)}
                className="flex-1 px-4 py-2.5 bg-cine-primary text-cine-bg-primary font-semibold rounded-lg hover:bg-[#e0a800] transition-colors"
              >
                Chỉnh Sửa Thông Tin
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  disabled={isLoadingUpdate}
                  className="flex-1 px-4 py-2.5 bg-cine-primary text-cine-bg-primary font-semibold rounded-lg hover:bg-[#e0a800] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckIcon />
                  Lưu Thay Đổi
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsEditMode(false);
                    setFullName(user.full_name || "");
                    setAvatar(user.avatar || "");
                    setAvatarFile(null);
                  }}
                  className="px-4 py-2.5 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                >
                  <XIcon />
                  Hủy
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Password Change Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0f172a]/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsPasswordSection(!isPasswordSection)}
          >
            <h2 className="text-xl font-semibold text-white">Bảo Mật</h2>
            <motion.div
              animate={{ rotate: isPasswordSection ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </div>

          {isPasswordSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4 pt-6 border-t border-white/10"
            >
              {passwordError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {passwordError}
                </motion.div>
              )}

              {passwordSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm"
                >
                  {passwordSuccess}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-cine-text-muted mb-2">
                  Mật Khẩu Hiện Tại
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-cine-text-muted focus:outline-none focus:border-cine-primary transition-colors"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#9ca3af] hover:text-white transition-colors"
                    aria-label={
                      showOldPassword
                        ? "Ẩn mật khẩu hiện tại"
                        : "Hiện mật khẩu hiện tại"
                    }
                  >
                    {showOldPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cine-text-muted mb-2">
                  Mật Khẩu Mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-cine-text-muted focus:outline-none focus:border-cine-primary transition-colors"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#9ca3af] hover:text-white transition-colors"
                    aria-label={
                      showNewPassword ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"
                    }
                  >
                    {showNewPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cine-text-muted mb-2">
                  Xác Nhận Mật Khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-cine-text-muted focus:outline-none focus:border-cine-primary transition-colors"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#9ca3af] hover:text-white transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? "Ẩn xác nhận mật khẩu"
                        : "Hiện xác nhận mật khẩu"
                    }
                  >
                    {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChangePassword}
                disabled={isLoadingUpdate}
                className="w-full px-4 py-2.5 bg-cine-primary text-cine-bg-primary font-semibold rounded-lg hover:bg-[#e0a800] transition-colors disabled:opacity-50"
              >
                {isLoadingUpdate ? "Đang xử lý..." : "Đổi Mật Khẩu"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
