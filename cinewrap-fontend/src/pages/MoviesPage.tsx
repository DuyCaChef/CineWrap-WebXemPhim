import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Skeleton } from "../components/common/Skeleton";

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: string;
  genre: string;
  year: number;
  country: string;
  ageRating: string;
  type: string;
  status: string;
  quality: string;
  isHot?: boolean;
}

interface FilterOptions {
  type: string;
  status: string;
  year: string;
  quality: string;
  sort: string;
}

// ---------------------------------------------------------------------------
// Meta Data mới cho Filter Bar
// ---------------------------------------------------------------------------

const MOVIE_TYPES = [
  { label: "Tất cả định dạng", value: "" },
  { label: "Phim Lẻ", value: "single" },
  { label: "Phim Bộ", value: "series" },
  { label: "Hoạt Hình / Anime", value: "animation" },
];

const MOVIE_STATUSES = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Phim Trọn Bộ", value: "complete" },
  { label: "Đang Chiếu / Tập Mới", value: "ongoing" },
];

const QUALITIES = [
  { label: "Tất cả chất lượng", value: "" },
  { label: "HD 4K Ultra", value: "4k" },
  { label: "Full HD 1080p", value: "1080p" },
];

const YEARS = [
  { label: "Tất cả năm", value: "" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "Trước 2022", value: "older" },
];

const SORT_OPTIONS = [
  { label: "Mới cập nhật", value: "newest" },
  { label: "Đánh giá cao", value: "rating" },
  { label: "Xem nhiều nhất", value: "views" },
];

// ---------------------------------------------------------------------------
// Mock Movies Data (32 Phim)
// ---------------------------------------------------------------------------

const MOCK_CATALOG_MOVIES: Movie[] = Array.from({ length: 32 }).map(
  (_, idx) => {
    const genres = [
      "Hành Động",
      "Viễn Tưởng",
      "Kinh Dị",
      "Tình Cảm",
      "Hình Sự",
    ];
    const countries = ["Mỹ", "Hàn Quốc", "Việt Nam", "Nhật Bản"];
    const types = ["single", "series", "animation"];
    const statuses = ["complete", "ongoing"];
    const qualities = ["4k", "1080p"];
    const years = [2024, 2023, 2022, 2021];

    return {
      id: `cat-m-${idx + 1}`,
      title: `Bộ Phim CineWrap ${idx + 1}`,
      poster: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format&q=80`,
      rating: (7.5 + (idx % 25) * 0.1).toFixed(1),
      genre: genres[idx % genres.length],
      year: years[idx % years.length],
      country: countries[idx % countries.length],
      ageRating: "16+",
      type: types[idx % types.length],
      status: statuses[idx % statuses.length],
      quality: qualities[idx % qualities.length],
      isHot: idx % 3 === 0,
    };
  },
);

const ITEMS_PER_PAGE = 24;

// ---------------------------------------------------------------------------
// Sub-component: CustomDropdown
// ---------------------------------------------------------------------------

interface CustomDropdownProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${fullWidth ? "w-full" : ""}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-[#0f172a]/90 px-4 py-2 text-xs font-semibold text-white shadow-md backdrop-blur-md transition-all duration-200 hover:border-[#00a3ff]/50 hover:bg-[#1e293b] focus:outline-none ${
          fullWidth ? "w-full" : ""
        }`}
      >
        <span>{selectedOption.label}</span>
        <svg
          className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#00a3ff]" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 min-w-[190px] w-full origin-top-left rounded-[8px] border border-white/15 bg-[#0f172a] p-1.5 shadow-2xl backdrop-blur-2xl animate-fade-in">
          {options
            .filter((opt) => opt.value !== "")
            .map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-xs transition ${
                    isSelected
                      ? "bg-[#00a3ff] text-white font-bold shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white font-medium"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: MoviesPageSkeleton
// ---------------------------------------------------------------------------

const MoviesPageSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Main Component: MoviesPage
// ---------------------------------------------------------------------------

const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Đọc params từ URL
  const currentGenre = searchParams.get("genre") || "";
  const currentCountry = searchParams.get("country") || "";
  const currentType = searchParams.get("type") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentYear = searchParams.get("year") || "";
  const currentQuality = searchParams.get("quality") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Cập nhật bộ lọc
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Reset toàn bộ bộ lọc
  const clearAllFilters = () => {
    setIsLoading(true);
    setSearchParams({ sort: "newest", page: "1" });
  };

  // Chuyển trang
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  // Lọc dữ liệu client
  const filteredMovies = MOCK_CATALOG_MOVIES.filter((m) => {
    if (currentType && m.type !== currentType) return false;
    if (currentStatus && m.status !== currentStatus) return false;
    if (currentQuality && m.quality !== currentQuality) return false;
    if (currentYear === "older" && m.year >= 2022) return false;
    if (
      currentYear &&
      currentYear !== "older" &&
      m.year !== parseInt(currentYear, 10)
    )
      return false;
    return true;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovies = filteredMovies.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <main className="min-h-screen w-full bg-[#0d1425] font-sans text-cine-text overflow-x-hidden">
      <Header />

      <div className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
        {/* ── Title & Breadcrumb ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#9ca3af] mb-2">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white transition"
            >
              Trang chủ
            </button>
            <span>/</span>
            <span className="text-[#00a3ff] font-semibold">Thư viện phim</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            {currentGenre
              ? `Thể loại: ${currentGenre}`
              : currentCountry
                ? `Phim ${currentCountry}`
                : "Khám Phá Phim"}
          </h1>
        </div>

        {/* ── FILTER BAR CHO DESKTOP (lg:flex) ── */}
        <div className="relative z-30 hidden lg:flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#131c2e]/80 border border-white/10 p-3.5 backdrop-blur-xl mt-3 mb-8 shadow-2xl">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <CustomDropdown
              options={MOVIE_TYPES}
              value={currentType}
              onChange={(val) => updateFilter("type", val)}
            />

            <CustomDropdown
              options={MOVIE_STATUSES}
              value={currentStatus}
              onChange={(val) => updateFilter("status", val)}
            />

            <CustomDropdown
              options={QUALITIES}
              value={currentQuality}
              onChange={(val) => updateFilter("quality", val)}
            />

            <CustomDropdown
              options={YEARS}
              value={currentYear}
              onChange={(val) => updateFilter("year", val)}
            />

            {(currentType ||
              currentStatus ||
              currentQuality ||
              currentYear ||
              currentGenre ||
              currentCountry) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#e50914] hover:underline px-2 transition"
              >
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9ca3af] font-medium">Sắp xếp:</span>
            <CustomDropdown
              options={SORT_OPTIONS}
              value={currentSort}
              onChange={(val) => updateFilter("sort", val)}
            />
          </div>
        </div>

        {/* ── MOBILE FILTER TRIGGER BUTTON ── */}
        <div className="flex lg:hidden items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#1e293b] px-4 py-2.5 text-sm font-bold text-white shadow-md active:scale-95"
          >
            <svg
              className="h-4 w-4 text-[#00a3ff]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Bộ lọc & Sắp xếp
          </button>

          <span className="text-xs text-[#9ca3af] font-semibold">
            {filteredMovies.length} kết quả
          </span>
        </div>

        {/* ── MOBILE BOTTOM SHEET FILTER (🟢 ĐÃ THÊM TÍNH NĂNG TỰ ĐÓNG KHI CLICK BACKDROP BÊN NGOÀI) ── */}
        {isMobileFilterOpen && (
          <div
            onClick={() => setIsMobileFilterOpen(false)} // 👈 Click lớp phủ tối bên ngoài sẽ tự động đóng
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm lg:hidden overflow-hidden cursor-pointer animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()} // 👈 Chặn sự kiện click bên trong khung để không bị đóng nhầm
              className="w-full rounded-t-3xl bg-[#0f172a] p-6 border-t border-white/15 max-h-[85vh] overflow-y-auto overflow-x-hidden space-y-4 cursor-default"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white">
                  Bộ lọc tìm kiếm
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-white/70 text-xl font-bold p-1 active:scale-90 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1.5">
                    Định dạng
                  </label>
                  <CustomDropdown
                    options={MOVIE_TYPES}
                    value={currentType}
                    onChange={(val) => updateFilter("type", val)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1.5">
                    Trạng thái
                  </label>
                  <CustomDropdown
                    options={MOVIE_STATUSES}
                    value={currentStatus}
                    onChange={(val) => updateFilter("status", val)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1.5">
                    Chất lượng
                  </label>
                  <CustomDropdown
                    options={QUALITIES}
                    value={currentQuality}
                    onChange={(val) => updateFilter("quality", val)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1.5">
                    Năm phát hành
                  </label>
                  <CustomDropdown
                    options={YEARS}
                    value={currentYear}
                    onChange={(val) => updateFilter("year", val)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1.5">
                    Sắp xếp
                  </label>
                  <CustomDropdown
                    options={SORT_OPTIONS}
                    value={currentSort}
                    onChange={(val) => updateFilter("sort", val)}
                    fullWidth
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-bold text-white active:scale-95 transition"
                >
                  Xóa lọc
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 rounded-xl bg-[#00a3ff] py-3 text-xs font-bold text-white shadow-lg active:scale-95 transition"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT GRID ── */}
        {isLoading ? (
          <MoviesPageSkeleton />
        ) : paginatedMovies.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1e293b] text-4xl mb-4 border border-white/10">
              🎬
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Không tìm thấy phim phù hợp
            </h3>
            <p className="text-sm text-[#9ca3af] max-w-md mb-6">
              Rất tiếc, không có bộ phim nào khớp với bộ lọc hiện tại của bạn.
              Hãy thử thay đổi hoặc xóa bộ lọc xem sao nhé.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="rounded-xl bg-[#00a3ff] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          /* ── MOVIE GRID ── */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {paginatedMovies.map((movie) => (
              <button
                key={movie.id}
                type="button"
                className="group text-left focus-visible:outline-none"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#1e293b] transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,163,255,0.4)]">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-40" />

                  {movie.isHot && (
                    <span className="absolute top-2 left-2 rounded-md bg-[#e50914] px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-md">
                      HOT
                    </span>
                  )}

                  <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-semibold text-[#ffc107] backdrop-blur-sm">
                    ★ {movie.rating}
                  </span>
                </div>

                <div className="mt-2.5 px-0.5">
                  <p className="truncate text-sm font-bold text-white leading-tight">
                    {movie.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#9ca3af]">
                    {movie.genre} · {movie.year}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── NUMBERED PAGINATION ── */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-3 w-full overflow-hidden">
            {/* Mobile (< 640px) */}
            <div className="flex sm:hidden items-center justify-between w-full max-w-xs px-2 gap-2">
              <button
                type="button"
                disabled={validPage === 1}
                onClick={() => goToPage(validPage - 1)}
                className="flex h-10 px-4 items-center gap-1 rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ‹ Trước
              </button>

              <span className="text-xs text-[#00a3ff] font-extrabold px-3 py-2 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20">
                {validPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={validPage === totalPages}
                onClick={() => goToPage(validPage + 1)}
                className="flex h-10 px-4 items-center gap-1 rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Sau ›
              </button>
            </div>

            {/* Desktop & Tablet (≥ 640px) */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full">
              <button
                type="button"
                disabled={validPage === 1}
                onClick={() => goToPage(1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                «
              </button>

              <button
                type="button"
                disabled={validPage === 1}
                onClick={() => goToPage(validPage - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === validPage;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`flex h-9 min-w-9 px-2.5 items-center justify-center rounded-xl border text-xs font-bold transition ${
                      isActive
                        ? "border-[#00a3ff] bg-[#00a3ff] text-white shadow-[0_0_12px_rgba(0,163,255,0.5)]"
                        : "border-white/10 bg-[#1e293b] text-[#9ca3af] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={validPage === totalPages}
                onClick={() => goToPage(validPage + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                ›
              </button>

              <button
                type="button"
                disabled={validPage === totalPages}
                onClick={() => goToPage(totalPages)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                »
              </button>
            </div>

            {/* Thông tin số trang */}
            <span className="text-xs text-[#9ca3af] font-medium">
              Trang <strong className="text-white">{validPage}</strong> /{" "}
              {totalPages} (Tổng {filteredMovies.length} phim)
            </span>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default MoviesPage;
