import React, { useState, useEffect } from "react";
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
  isHot?: boolean;
}

interface FilterOptions {
  genre: string;
  country: string;
  age: string;
  year: string;
  sort: string;
}

// ---------------------------------------------------------------------------
// Mock Meta Data cho Dropdowns Filter
// ---------------------------------------------------------------------------

const GENRES = [
  { label: "Tất cả thể loại", value: "" },
  { label: "Hành Động", value: "action" },
  { label: "Viễn Tưởng", value: "sci-fi" },
  { label: "Kinh Dị", value: "horror" },
  { label: "Tình Cảm", value: "romance" },
  { label: "Tâm Lý", value: "drama" },
  { label: "Hình Sự", value: "crime" },
  { label: "Hoạt Hình", value: "animation" },
];

const COUNTRIES = [
  { label: "Tất cả quốc gia", value: "" },
  { label: "Mỹ", value: "us" },
  { label: "Hàn Quốc", value: "kr" },
  { label: "Việt Nam", value: "vn" },
  { label: "Nhật Bản", value: "jp" },
  { label: "Trung Quốc", value: "cn" },
];

const AGE_RATINGS = [
  { label: "Tất cả độ tuổi", value: "" },
  { label: "P - Mọi lứa tuổi", value: "P" },
  { label: "13+ Khuyên dùng", value: "13+" },
  { label: "16+ Khuyên dùng", value: "16+" },
  { label: "18+ Giới hạn", value: "18+" },
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
// Mock Movies Data (32 Phim để test Phân Trang)
// ---------------------------------------------------------------------------

const MOCK_CATALOG_MOVIES: Movie[] = Array.from({ length: 32 }).map(
  (_, idx) => {
    const genres = ["action", "sci-fi", "horror", "romance", "drama", "crime"];
    const countries = ["us", "kr", "vn", "jp", "cn"];
    const ages = ["P", "13+", "16+", "18+"];
    const years = [2024, 2023, 2022, 2021];

    const g = genres[idx % genres.length];
    const c = countries[idx % countries.length];
    const a = ages[idx % ages.length];
    const y = years[idx % years.length];

    return {
      id: `cat-m-${idx + 1}`,
      title: `Bộ Phim CineWrap ${idx + 1}`,
      poster: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format&q=80`,
      rating: (7.5 + (idx % 25) * 0.1).toFixed(1),
      genre: GENRES.find((item) => item.value === g)?.label || "Hành Động",
      year: y,
      country: c,
      ageRating: a,
      isHot: idx % 3 === 0,
    };
  },
);

const ITEMS_PER_PAGE = 24; // 24 phim / trang

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
  const currentAge = searchParams.get("age") || "";
  const currentYear = searchParams.get("year") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Cuộn trang lên đỉnh và tắt Loading sau khi params thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Tắt loading sau 0.6 giây giả lập fetch API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Cập nhật URL Parameter khi thay đổi bộ lọc
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setIsLoading(true); // Bật loading ở event handler trước khi đổi URL
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1"); // Đặt lại về trang 1 khi lọc mới
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

  // Lọc dữ liệu client giả lập
  const filteredMovies = MOCK_CATALOG_MOVIES.filter((m) => {
    if (currentCountry && m.country !== currentCountry) return false;
    if (currentAge && m.ageRating !== currentAge) return false;
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
    <main className="min-h-screen w-full bg-[#0d1425] font-sans text-cine-text">
      <Header />

      <div className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto">
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
            Khám Phá Phim
          </h1>
        </div>

        {/* ── FILTER BAR FOR DESKTOP (Ẩn trên mobile) ── */}
        <div className="hidden lg:flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#1e293b]/70 border border-white/10 p-4 backdrop-blur-md mb-8">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Genre Select */}
            <select
              value={currentGenre}
              onChange={(e) => updateFilter("genre", e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0f172a] px-3.5 py-2 text-sm font-semibold text-white focus:border-[#00a3ff] focus:outline-none"
            >
              {GENRES.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>

            {/* Country Select */}
            <select
              value={currentCountry}
              onChange={(e) => updateFilter("country", e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0f172a] px-3.5 py-2 text-sm font-semibold text-white focus:border-[#00a3ff] focus:outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Age Rating Select */}
            <select
              value={currentAge}
              onChange={(e) => updateFilter("age", e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0f172a] px-3.5 py-2 text-sm font-semibold text-white focus:border-[#00a3ff] focus:outline-none"
            >
              {AGE_RATINGS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={currentYear}
              onChange={(e) => updateFilter("year", e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0f172a] px-3.5 py-2 text-sm font-semibold text-white focus:border-[#00a3ff] focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>

            {/* Clear button */}
            {(currentGenre || currentCountry || currentAge || currentYear) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#e50914] hover:underline px-2"
              >
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9ca3af] font-medium">Sắp xếp:</span>
            <select
              value={currentSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0f172a] px-3.5 py-2 text-sm font-semibold text-[#00a3ff] focus:border-[#00a3ff] focus:outline-none"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── MOBILE FILTER TRIGGER BUTTON (Hiện trên mobile) ── */}
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

        {/* ── MOBILE BOTTOM SHEET FILTER ── */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in">
            <div className="w-full rounded-t-3xl bg-[#0f172a] p-6 border-t border-white/15 max-h-[85vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white">
                  Bộ lọc tìm kiếm
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-white/70 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                    Thể loại
                  </label>
                  <select
                    value={currentGenre}
                    onChange={(e) => updateFilter("genre", e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1e293b] p-3 text-sm text-white"
                  >
                    {GENRES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                    Quốc gia
                  </label>
                  <select
                    value={currentCountry}
                    onChange={(e) => updateFilter("country", e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1e293b] p-3 text-sm text-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                    Độ tuổi
                  </label>
                  <select
                    value={currentAge}
                    onChange={(e) => updateFilter("age", e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1e293b] p-3 text-sm text-white"
                  >
                    {AGE_RATINGS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                    Sắp xếp
                  </label>
                  <select
                    value={currentSort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1e293b] p-3 text-sm text-[#00a3ff] font-bold"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-bold text-white"
                >
                  Xóa lọc
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 rounded-xl bg-[#00a3ff] py-3 text-xs font-bold text-white shadow-lg"
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
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Trang đầu */}
              <button
                type="button"
                disabled={validPage === 1}
                onClick={() => goToPage(1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                «
              </button>

              {/* Trang trước */}
              <button
                type="button"
                disabled={validPage === 1}
                onClick={() => goToPage(validPage - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                ‹
              </button>

              {/* Các nút trang số */}
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

              {/* Trang sau */}
              <button
                type="button"
                disabled={validPage === totalPages}
                onClick={() => goToPage(validPage + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e293b] text-xs font-bold text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                ›
              </button>

              {/* Trang cuối */}
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
