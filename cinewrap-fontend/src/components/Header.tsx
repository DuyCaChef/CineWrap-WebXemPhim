import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Typo_CineWrap from "../assets/images/Typo_CineWrap.png";
import { AuthModal } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const genres: DropdownItem[] = [
  { label: "Hành Động", href: "/the-loai/hanh-dong" },
  { label: "Tình Cảm", href: "/the-loai/tinh-cam" },
  { label: "Hài Hước", href: "/the-loai/hai-huoc" },
  { label: "Kinh Dị", href: "/the-loai/kinh-di" },
  { label: "Khoa Học Viễn Tưởng", href: "/the-loai/khoa-hoc-vien-tuong" },
  { label: "Hoạt Hình", href: "/the-loai/hoat-hinh" },
  { label: "Tâm Lý", href: "/the-loai/tam-ly" },
  { label: "Phiêu Lưu", href: "/the-loai/phieu-luu" },
  { label: "Cổ Trang", href: "/the-loai/co-trang" },
  { label: "Thần Thoại", href: "/the-loai/than-thoai" },
];

const countries: DropdownItem[] = [
  { label: "Việt Nam", href: "/quoc-gia/viet-nam" },
  { label: "Hàn Quốc", href: "/quoc-gia/han-quoc" },
  { label: "Trung Quốc", href: "/quoc-gia/trung-quoc" },
  { label: "Nhật Bản", href: "/quoc-gia/nhat-ban" },
  { label: "Thái Lan", href: "/quoc-gia/thai-lan" },
  { label: "Mỹ", href: "/quoc-gia/my" },
  { label: "Anh", href: "/quoc-gia/anh" },
  { label: "Pháp", href: "/quoc-gia/phap" },
  { label: "Ấn Độ", href: "/quoc-gia/an-do" },
  { label: "Hồng Kông", href: "/quoc-gia/hong-kong" },
];

const actors: DropdownItem[] = [
  { label: "Song Joong-ki", href: "/dien-vien/song-joong-ki" },
  { label: "IU (Lee Ji-eun)", href: "/dien-vien/iu" },
  { label: "Triệu Lộ Tư", href: "/dien-vien/trieu-lo-tu" },
  { label: "Tom Hanks", href: "/dien-vien/tom-hanks" },
  { label: "Ngô Kinh", href: "/dien-vien/ngo-kinh" },
  { label: "Scarlett Johansson", href: "/dien-vien/scarlett-johansson" },
];

const navItems: NavItem[] = [
  { label: "Thư viện phim", href: "/movies" },
  { label: "Thể Loại", dropdown: genres },
  { label: "Phim Lẻ", href: "/movies?type=single" },
  { label: "Phim Bộ", href: "/movies?type=series" },
  { label: "Quốc Gia", dropdown: countries },
  { label: "Diễn Viên", dropdown: actors },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
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

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── DESKTOP DROPDOWN ─────────────────────────────────────────────────────────
interface DropdownProps {
  items: DropdownItem[];
  isOpen: boolean;
}

const DesktopDropdown = ({ items, isOpen }: DropdownProps) => {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-cine-bg-secondary/95 backdrop-blur-md transition-all duration-200 z-50 ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      {/* Arrow tip */}
      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-white/10 bg-cine-bg-secondary" />

      <ul className="py-2 relative z-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="flex items-center px-4 py-2.5 text-[13px] font-medium text-cine-text-muted hover:text-cine-primary hover:bg-cine-primary/10 transition-colors duration-150 group"
            >
              <span className="mr-2 w-1.5 h-1.5 rounded-full bg-cine-primary opacity-50 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── SEARCH OVERLAY ──────────────────────────────────────────────────────────
interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div
      className={`absolute inset-0 w-full h-full flex items-center px-4 md:px-8 bg-cine-bg-primary/95 backdrop-blur-xl transition-all duration-300 z-[60] ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="flex items-center w-full max-w-4xl mx-auto gap-3">
        <span className="text-cine-primary">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm phim, diễn viên, đạo diễn..."
          className="flex-1 bg-transparent text-base text-white placeholder:text-cine-text-muted outline-none placeholder:font-normal"
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
        <button
          onClick={onClose}
          className="p-2 rounded-full text-cine-text-muted hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const Header: React.FC = () => {
  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng trang
  const { user, isAuthenticated, isLoading, logout } = useAuth(); // Sử dụng hook useAuth để lấy thông tin người dùng và trạng thái xác thực
  const [scrolled, setScrolled] = useState(false);

  // Auth Modal State
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Navigation State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<
    string | null
  >(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const displayName = user?.full_name || user?.email || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const isSignedIn = !isLoading && isAuthenticated && !!user;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = () => setActiveDropdown(null);
    if (activeDropdown) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [activeDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // Desktop Hover Logic
  const handleMouseEnter = (label: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(label);
  };
  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Mobile Accordion Logic
  const toggleMobileSection = (label: string) => {
    setMobileExpandedSection((prev) => (prev === label ? null : label));
  };

  // Logout Logic
  const handleLogout = async () => {
    try {
      setUserMenuOpen(false); // Đóng dropdown menudesktop
      setIsMobileMenuOpen(false); // Đóng drawer mobile menu
      await logout(); // Gọi API logout từ AuthProvider
      navigate("/");
    } catch (error) {
      console.error("Đăng xuất thất bại", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-20 z-50 px-4 md:px-8 flex justify-between items-center transition-all duration-300 ${
        scrolled || isMobileMenuOpen || searchOpen
          ? "bg-cine-bg-primary/95 backdrop-blur-sm border-b border-white/40"
          : "bg-cine-bg-primary/95 backdrop-blur-sm border-b border-white/20"
      }`}
    >
      {/* ── SEARCH OVERLAY ── */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── CỘT TRÁI: LOGO ── */}
      <div className="flex w-auto lg:w-1/4 items-center">
        <img
          src={Typo_CineWrap}
          alt="CineWrap Typo"
          className="w-28 md:w-36 lg:w-44 cursor-pointer transition-all duration-300"
          onClick={() => navigate("/")}
        />
      </div>

      {/* ── CỘT GIỮA: THANH ĐIỀU HƯỚNG (Desktop) ── */}
      <nav className="hidden lg:flex flex-1 justify-center items-center gap-5 xl:gap-8 text-[13px] xl:text-sm font-medium">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
            onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
          >
            {item.href ? (
              <a
                href={item.href}
                className="text-cine-text hover:text-cine-primary transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </a>
            ) : (
              <button
                className={`flex items-center gap-1.5 transition-colors duration-200 whitespace-nowrap ${
                  activeDropdown === item.label
                    ? "text-cine-primary"
                    : "text-cine-text hover:text-cine-primary"
                }`}
              >
                {item.label}
                <ChevronDownIcon
                  className={`transition-transform duration-200 ${
                    activeDropdown === item.label ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}

            {/* Sub-menu Dropdown */}
            {item.dropdown && (
              <DesktopDropdown
                items={item.dropdown}
                isOpen={activeDropdown === item.label}
              />
            )}
          </div>
        ))}
      </nav>

      {/* ── CỘT PHẢI: BUTTONS ── */}
      <div className="flex w-auto lg:w-1/4 items-center justify-end gap-6 md:gap-8">
        {/* Nút Tìm kiếm */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 text-cine-text hover:text-cine-primary transition-colors duration-200"
          aria-label="Tìm kiếm"
        >
          <SearchIcon />
        </button>

        {/* Nút Đăng nhập / Avatar người dùng */}
        {isSignedIn ? (
          <div ref={userMenuRef} className="relative">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-cine-primary/15 text-sm font-semibold text-cine-primary shadow-lg shadow-cine-primary/10 transition-all duration-300 hover:border-cine-primary/60"
              aria-label="Tài khoản"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{avatarInitial}</span>
              )}
            </motion.button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-3 w-52 sm:w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/95 shadow-2xl backdrop-blur-xl"
                >
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      {displayName}
                    </p>
                    <p className="mt-1 text-xs text-cine-text-muted">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center px-4 py-3 text-left text-sm text-cine-text transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Thông tin cá nhân
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/saved-movies");
                    }}
                    className="flex w-full items-center px-4 py-3 text-left text-sm text-cine-text transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Danh sách phim đã lưu
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Đăng xuất
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAuthOpen(true);
              setAuthMode("login");
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 md:px-5 md:py-2.5 text-[13px] font-bold tracking-wide text-cine-bg-primary uppercase bg-cine-primary border border-cine-primary rounded-full shadow-lg shadow-cine-primary/20 transition-all duration-300 hover:bg-[#e0a800]"
          >
            <UserIcon />
            <span className="hidden md:block whitespace-nowrap">Đăng nhập</span>
          </motion.button>
        )}

        {/* Nút Hamburger (Mobile) */}
        <button
          className="lg:hidden p-2 text-cine-text hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* ── MOBILE MENU DRAWER (Accordion) ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full max-h-[calc(100vh-80px)] overflow-y-auto bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/10 flex flex-col lg:hidden shadow-2xl custom-scrollbar"
          >
            {navItems.map((item) => (
              <div
                key={item.label}
                className="border-b border-white/5 last:border-none"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-6 py-4 text-sm font-semibold text-cine-text hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <>
                    <button
                      onClick={() => toggleMobileSection(item.label)}
                      className={`w-full flex items-center justify-between px-6 py-4 text-sm font-semibold transition-colors duration-150 ${
                        mobileExpandedSection === item.label
                          ? "text-cine-primary bg-cine-primary/5"
                          : "text-cine-text hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                      <ChevronDownIcon
                        className={`transition-transform duration-200 ${
                          mobileExpandedSection === item.label
                            ? "rotate-180 text-cine-primary"
                            : "text-cine-text-muted"
                        }`}
                      />
                    </button>
                    {/* Danh sách con (Sub-menu) */}
                    <AnimatePresence>
                      {mobileExpandedSection === item.label &&
                        item.dropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-black/20"
                          >
                            {item.dropdown.map((sub) => (
                              <a
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 pl-10 pr-6 py-3 text-sm text-cine-text-muted hover:text-cine-primary hover:bg-white/5 transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-cine-primary opacity-50" />
                                {sub.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            ))}
            {/* Lặp lại nút đăng nhập cho Mobile ở cuối menu */}
            <div className="p-6">
              {isSignedIn ? (
                <div className="flex flex-col gap-3">
                  {/* Nút Xem Hồ sơ */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 text-cine-text font-semibold active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-cine-primary/15 text-sm font-semibold text-cine-primary">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{avatarInitial}</span>
                        )}
                      </div>
                      <span className="truncate">{displayName}</span>
                    </div>
                    <span className="text-xs text-cine-primary font-bold">
                      Hồ sơ →
                    </span>
                  </button>

                  {/* 🚀 NÚT ĐĂNG XUẤT CHO MOBILE */}
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-bold text-sm active:scale-95 transition-all hover:bg-red-500/20"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setAuthMode("login");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-cine-primary text-cine-bg-primary font-bold rounded-xl active:scale-95 transition-transform"
                >
                  <UserIcon />
                  Đăng nhập ngay
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        key={authOpen ? authMode : "closed"}
      />
    </header>
  );
};
