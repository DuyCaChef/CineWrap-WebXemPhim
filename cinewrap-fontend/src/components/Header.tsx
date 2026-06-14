import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

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
  { label: "Thể Loại", dropdown: genres },
  { label: "Phim Lẻ", href: "/phim-le" },
  { label: "Phim Bộ", href: "/phim-bo" },
  { label: "Quốc Gia", dropdown: countries },
  { label: "Diễn Viên", dropdown: actors },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

const SearchIcon = () => (
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

const MenuIcon = () => (
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
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FilmIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18 3v2h-2V3H8v2H6V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2v-2h2v2h8v-2h2v2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8 17H6v-2h2zm0-4H6v-2h2zm0-4H6V7h2zm10 8h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V7h2z" />
  </svg>
);

// ─── Dropdown Component ───────────────────────────────────────────────────────

interface DropdownProps {
  items: DropdownItem[];
  isOpen: boolean;
}

const Dropdown = ({ items, isOpen }: DropdownProps) => {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-200 z-50 ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      style={{ background: "#1e293b" }}
    >
      {/* Arrow tip */}
      <div
        className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-white/10"
        style={{ background: "#1e293b" }}
      />
      <ul className="py-1">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-150"
              style={{ color: "#9ca3af" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffc107";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,193,7,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              <span
                className="mr-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#ffc107", opacity: 0.5 }}
              />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Search Bar ───────────────────────────────────────────────────────────────

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
      className={`absolute inset-x-0 top-0 h-full flex items-center px-4 transition-all duration-300 z-20 ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
      style={{ background: "#0f172a" }}
    >
      <div className="flex items-center w-full max-w-2xl mx-auto gap-3">
        <span style={{ color: "#ffc107" }}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm phim, diễn viên, đạo diễn..."
          className="flex-1 bg-transparent text-base outline-none placeholder:font-normal"
          style={{
            color: "#ffffff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors duration-150"
          style={{ color: "#9ca3af" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")
          }
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

// ─── Mobile Menu ─────────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "#1e293b",
          boxShadow: "4px 0 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Logo />
          <button
            onClick={onClose}
            className="p-1"
            style={{ color: "#9ca3af" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleSection(item.label)}
                    className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold transition-colors duration-150"
                    style={{
                      color: openSection === item.label ? "#ffc107" : "#ffffff",
                    }}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`transition-transform duration-200 ${
                        openSection === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection === item.label ? "max-h-96" : "max-h-0"
                    }`}
                    style={{
                      background: "rgba(0,0,0,0.2)",
                    }}
                  >
                    {item.dropdown.map((sub) => (
                      <a
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        className="flex items-center gap-2.5 pl-8 pr-5 py-2.5 text-sm transition-colors duration-150"
                        style={{ color: "#9ca3af" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLAnchorElement).style.color =
                            "#ffc107")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLAnchorElement).style.color =
                            "#9ca3af")
                        }
                      >
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: "#ffc107", opacity: 0.5 }}
                        />
                        {sub.label}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center px-5 py-3 text-sm font-semibold transition-colors duration-150"
                  style={{ color: "#ffffff" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "#ffc107")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "#ffffff")
                  }
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Login */}
        <div
          className="p-5 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <a
            href="/dang-nhap"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: "#ffc107",
              color: "#0f172a",
            }}
          >
            <UserIcon />
            Đăng Nhập
          </a>
        </div>
      </div>
    </>
  );
};

// ─── Logo ────────────────────────────────────────────────────────────────────

const Logo = () => (
  <a href="/" className="flex items-center gap-2 select-none">
    <div
      className="flex items-center justify-center w-9 h-9 rounded-lg"
      style={{ background: "#ffc107" }}
    >
      <span style={{ color: "#0f172a" }}>
        <FilmIcon />
      </span>
    </div>
    <span
      className="text-xl font-extrabold tracking-tight leading-none"
      style={{ color: "#ffffff" }}
    >
      Cine
      <span style={{ color: "#ffc107" }}>Hub</span>
    </span>
  </a>
);

// ─── Main Header ─────────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener("click", handler);
    }
    return () => document.removeEventListener("click", handler);
  }, [activeDropdown]);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(15,23,42,0.95)"
            : "linear-gradient(to bottom, rgba(15,23,42,0.9) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Search overlay (covers full header) */}
          <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.dropdown && handleMouseEnter(item.label)
                }
                onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150"
                    style={{ color: "#9ca3af" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#ffffff")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#9ca3af")
                    }
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150"
                    style={{
                      color:
                        activeDropdown === item.label ? "#ffffff" : "#9ca3af",
                    }}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`transition-transform duration-200 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {item.dropdown && (
                  <Dropdown
                    items={item.dropdown}
                    isOpen={activeDropdown === item.label}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-lg transition-colors duration-150"
              style={{ color: "#9ca3af" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")
              }
              aria-label="Tìm kiếm"
            >
              <SearchIcon />
            </button>

            {/* Login button — desktop */}
            <a
              href="/dang-nhap"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
              style={{
                color: "#ffc107",
                border: "1.5px solid #ffc107",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#ffc107";
                el.style.color = "#0f172a";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "#ffc107";
              }}
            >
              <UserIcon />
              Đăng Nhập
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-lg transition-colors duration-150"
              style={{ color: "#9ca3af" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")
              }
              aria-label="Mở menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
