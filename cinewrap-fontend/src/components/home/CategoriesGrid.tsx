import React, { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Genre {
  id: string;
  name: string;
  /** Icon emoji hoặc SVG path string */
  icon: string;
  /** Ảnh nền minh họa từ Unsplash */
  image: string;
  /** Số lượng phim */
  count: number;
  /**
   * Kích thước ô trong Bento Grid:
   *  "wide"  → chiếm 2 cột (col-span-2)
   *  "tall"  → chiếm 2 hàng (row-span-2)
   *  "large" → 2 cột × 2 hàng
   *  "small" → 1×1 mặc định
   */
  size: "wide" | "tall" | "large" | "small";
  /** Màu accent riêng của thể loại (dùng cho glow hover) */
  accentColor: string;
}

// ---------------------------------------------------------------------------
// Mock data — 8 thể loại
// ---------------------------------------------------------------------------

const GENRES: Genre[] = [
  {
    id: "g-1",
    name: "Hành Động",
    icon: "⚔️",
    image:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=600&fit=crop&auto=format",
    count: 214,
    size: "large", // 2×2 — ô chủ đạo góc trên trái
    accentColor: "rgba(229,9,20,0.5)",
  },
  {
    id: "g-2",
    name: "Viễn Tưởng",
    icon: "🚀",
    image:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&h=400&fit=crop&auto=format",
    count: 178,
    size: "wide", // 2×1 — ngang
    accentColor: "rgba(0,163,255,0.5)",
  },
  {
    id: "g-3",
    name: "Kinh Dị",
    icon: "👁️",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop&auto=format",
    count: 132,
    size: "tall", // 1×2 — dọc
    accentColor: "rgba(139,0,0,0.6)",
  },
  {
    id: "g-4",
    name: "Tâm Lý",
    icon: "🧠",
    image:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=400&fit=crop&auto=format",
    count: 96,
    size: "small",
    accentColor: "rgba(139,92,246,0.5)",
  },
  {
    id: "g-5",
    name: "Tình Cảm",
    icon: "💫",
    image:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=400&fit=crop&auto=format",
    count: 153,
    size: "small",
    accentColor: "rgba(236,72,153,0.5)",
  },
  {
    id: "g-6",
    name: "Gia Đình",
    icon: "🏡",
    image:
      "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=400&fit=crop&auto=format",
    count: 112,
    size: "small",
    accentColor: "rgba(16,185,129,0.5)", // Màu xanh lục ấm áp
  },
  {
    id: "g-7",
    name: "Anime",
    icon: "🌸",
    image:
      "https://images.unsplash.com/photo-1578356983759-450f3de0a4ab?w=400&h=400&fit=crop&auto=format",
    count: 245,
    size: "small",
    accentColor: "rgba(244,114,182,0.5)", // Màu hồng hoa anh đào
  },
  {
    id: "g-8",
    name: "Phiêu Lưu",
    icon: "🌍",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&auto=format",
    count: 119,
    size: "wide", // 2×1 — ngang
    accentColor: "rgba(16,185,129,0.5)",
  },
  {
    id: "g-9",
    name: "Hình Sự",
    icon: "🔍",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=400&fit=crop&auto=format",
    count: 87,
    size: "small",
    accentColor: "rgba(245,158,11,0.5)",
  },
  {
    id: "g-10",
    name: "Hoạt Hình",
    icon: "🎨",
    image:
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=400&fit=crop&auto=format",
    count: 74,
    size: "small",
    accentColor: "rgba(251,191,36,0.5)",
  },
];

// ---------------------------------------------------------------------------
// Helper: map size → Tailwind span classes
// ---------------------------------------------------------------------------

const sizeClasses: Record<Genre["size"], string> = {
  large: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  small: "col-span-1 row-span-1",
};

/** Chiều cao cơ bản của 1 hàng lưới */
const rowHeightClasses: Record<Genre["size"], string> = {
  large: "h-full min-h-[260px] sm:min-h-[300px]",
  wide: "h-full min-h-[120px] sm:min-h-[140px]",
  tall: "h-full min-h-[260px] sm:min-h-[300px]",
  small: "h-full min-h-[120px] sm:min-h-[140px]",
};

// ---------------------------------------------------------------------------
// Sub-component: GenreCell
// ---------------------------------------------------------------------------

interface GenreCellProps {
  genre: Genre;
}

const GenreCell: React.FC<GenreCellProps> = ({ genre }) => {
  const [hovered, setHovered] = useState(false);
  const isLarge = genre.size === "large" || genre.size === "tall";

  return (
    <button
      type="button"
      aria-label={`Khám phá thể loại ${genre.name}`}
      className={[
        "group relative overflow-hidden rounded-2xl",
        sizeClasses[genre.size],
        rowHeightClasses[genre.size],
        // Hover: nâng nhẹ + viền sáng
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
      ].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 0 28px ${genre.accentColor}, 0 8px 32px rgba(0,0,0,0.4)`
          : "0 2px 12px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.35s ease, transform 0.3s ease",
      }}
    >
      {/* ── Ảnh nền ── */}
      <img
        src={genre.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className={[
          "absolute inset-0 h-full w-full object-cover",
          "transition-transform duration-500 ease-out",
          "group-hover:scale-110",
        ].join(" ")}
      />

      {/* ── Lớp tối phủ nền (darken) ── */}
      <div
        className={[
          "absolute inset-0",
          "bg-gradient-to-t from-black/75 via-black/40 to-black/20",
          "transition-opacity duration-300",
          "group-hover:opacity-60",
        ].join(" ")}
      />

      {/* ── Lớp màu accent mờ phủ (tô màu chủ đề thể loại) ── */}
      <div
        className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-35"
        style={{ backgroundColor: genre.accentColor }}
      />

      {/* ── Nội dung – label kính mờ ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
        {/* Khối glassmorphism chứa icon + tên */}
        <div
          className={[
            "flex flex-col items-center gap-1.5",
            "rounded-xl border border-white/15 bg-white/10 backdrop-blur-md",
            "px-4 py-2.5 sm:px-5 sm:py-3",
            "transition-all duration-300",
            "group-hover:bg-white/18 group-hover:border-white/25",
            isLarge ? "gap-2 px-5 py-3 sm:px-7 sm:py-4" : "",
          ].join(" ")}
        >
          {/* Icon */}
          <span
            className={[
              "leading-none select-none",
              isLarge ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl",
            ].join(" ")}
            aria-hidden="true"
          >
            {genre.icon}
          </span>

          {/* Tên thể loại */}
          <span
            className={[
              "font-bold text-white text-center leading-tight",
              isLarge
                ? "text-base sm:text-lg lg:text-xl"
                : "text-xs sm:text-sm",
            ].join(" ")}
          >
            {genre.name}
          </span>
        </div>

        {/* Số lượng phim — hiện khi hover */}
        <span
          className={[
            "text-xs text-white/70 font-medium",
            "transition-all duration-300",
            "opacity-0 translate-y-1",
            "group-hover:opacity-100 group-hover:translate-y-0",
          ].join(" ")}
        >
          {genre.count} phim
        </span>
      </div>

      {/* ── Mũi tên khám phá (chỉ hiện trên ô large khi hover) ── */}
      {genre.size === "large" && (
        <div
          className={[
            "absolute bottom-4 right-4",
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-white/15 border border-white/20 backdrop-blur-sm",
            "transition-all duration-300",
            "opacity-0 translate-x-1",
            "group-hover:opacity-100 group-hover:translate-x-0",
          ].join(" ")}
          aria-hidden="true"
        >
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

// ---------------------------------------------------------------------------
// Main component: CategoriesGrid
// ---------------------------------------------------------------------------

const CategoriesGrid: React.FC = () => {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
      {/* ── Section header ── */}
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-6 w-[3px] rounded-full bg-[#00a3ff] sm:h-7"
          />
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Khám Phá Thể Loại
          </h2>
        </div>
        <button
          type="button"
          className="rounded text-xs font-semibold text-[#00a3ff] transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] sm:text-sm"
        >
          Tất cả thể loại →
        </button>
      </div>

      {/*
        ── Bento Grid ──
        Desktop (lg): 4 cột cố định
          - Ô "large"  (g-1 Hành Động): col-span-2 row-span-2 → ô chủ đạo
          - Ô "tall"   (g-3 Kinh Dị)  : col-span-1 row-span-2 → cột dọc
          - Ô "wide"   (g-2, g-6)     : col-span-2 row-span-1 → ngang dài
          - Ô "small"  (g-4,5,7,8)    : 1×1
        Mobile (mặc định): 2 cột, auto-rows, bỏ row-span để lưới flat
      */}

      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:auto-rows-[140px] lg:gap-4">
        {GENRES.map((genre) => (
          <GenreCell key={genre.id} genre={genre} />
        ))}
      </div>

      {/* Mobile / Tablet grid — 2 cột, auto height, không dùng row-span */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            type="button"
            aria-label={`Khám phá thể loại ${genre.name}`}
            className={[
              "group relative overflow-hidden rounded-2xl",
              // Ô "large" & "wide" & "tall" → mobile đều về col-span-2
              genre.size === "large" || genre.size === "wide"
                ? "col-span-2 h-32 sm:h-40"
                : "col-span-1 h-28 sm:h-36",
              "transition-all duration-300 ease-out hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            ].join(" ")}
          >
            {/* Ảnh nền */}
            <img
              src={genre.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Darken overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20 transition-opacity duration-300 group-hover:opacity-60" />

            {/* Accent tint */}
            <div
              className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-35"
              style={{ backgroundColor: genre.accentColor }}
            />

            {/* Label glassmorphism */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
              <div className="flex flex-col items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md transition-all duration-300 group-hover:bg-white/18 group-hover:border-white/25">
                <span className="text-xl leading-none" aria-hidden="true">
                  {genre.icon}
                </span>
                <span className="text-xs font-bold text-white sm:text-sm">
                  {genre.name}
                </span>
              </div>
              <span className="text-[11px] font-medium text-white/70 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {genre.count} phim
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoriesGrid;
