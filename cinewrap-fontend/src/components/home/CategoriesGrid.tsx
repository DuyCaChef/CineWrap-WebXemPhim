import React from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryViName } from "../../utils/formatters";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface CategoryData {
  id: number | string;
  name: string | Record<string, string>; // Khóa kiểu any bằng union type chuẩn xác
  slug: string;
  color?: string;
  shadow?: string;
  icon?: string;
}

interface CategoriesGridProps {
  categories?: CategoryData[];
}

// Danh sách danh mục mẫu đẹp mắt nếu API chưa kịp tải xong
const FALLBACK_CATEGORIES: CategoryData[] = [
  {
    id: "g-1",
    slug: "hanh-dong",
    name: { vi: "Hành Động" },
    icon: "⚔️",
    color: "from-red-600/80 to-rose-900/80",
    shadow: "hover:shadow-red-500/20",
  },
  {
    id: "g-2",
    slug: "vien-tuong",
    name: { vi: "Viễn Tưởng" },
    icon: "🚀",
    color: "from-blue-600/80 to-cyan-900/80",
    shadow: "hover:shadow-cyan-500/20",
  },
  {
    id: "g-3",
    slug: "kinh-di",
    name: { vi: "Kinh Dị" },
    icon: "👁️",
    color: "from-purple-900/80 to-slate-950/80",
    shadow: "hover:shadow-purple-500/20",
  },
  {
    id: "g-4",
    slug: "tam-ly",
    name: { vi: "Tâm Lý" },
    icon: "🧠",
    color: "from-violet-600/80 to-purple-900/80",
    shadow: "hover:shadow-violet-500/20",
  },
  {
    id: "g-5",
    slug: "tinh-cam",
    name: { vi: "Tình Cảm" },
    icon: "💫",
    color: "from-pink-600/80 to-rose-900/80",
    shadow: "hover:shadow-pink-500/20",
  },
  {
    id: "g-6",
    slug: "gia-dinh",
    name: { vi: "Gia Đình" },
    icon: "🏡",
    color: "from-emerald-600/80 to-teal-900/80",
    shadow: "hover:shadow-emerald-500/20",
  },
  {
    id: "g-7",
    slug: "hoat-hinh",
    name: { vi: "Hoạt Hình" },
    icon: "🎨",
    color: "from-amber-500/80 to-orange-900/80",
    shadow: "hover:shadow-amber-500/20",
  },
  {
    id: "g-8",
    slug: "phieu-luu",
    name: { vi: "Phiêu Lưu" },
    icon: "🌍",
    color: "from-teal-600/80 to-emerald-900/80",
    shadow: "hover:shadow-teal-500/20",
  },
];

// ---------------------------------------------------------------------------
// Main component: CategoriesGrid
// ---------------------------------------------------------------------------

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories = [],
}) => {
  const navigate = useNavigate();

  // Ưu tiên sử dụng danh sách truyền từ API, nếu trống sẽ dùng danh sách Fallback
  const displayList = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
      {/* ── Section header ── */}
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-6 w-0.75 rounded-full bg-[#00a3ff] sm:h-7"
          />
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Khám Phá Thể Loại
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate("/movies")}
          className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 text-xs font-semibold text-[#00a3ff] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white cursor-pointer sm:text-sm"
        >
          Tất cả thể loại
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 3.5L10 8l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Bento Grid Tối Ưu ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:gap-4">
        {displayList.slice(0, 8).map((cat, idx) => {
          // Lấy màu sắc mặc định nếu không có trong dữ liệu API
          const fallbackStyle =
            FALLBACK_CATEGORIES[idx % FALLBACK_CATEGORIES.length];
          const colorClass = cat.color || fallbackStyle.color;
          const shadowClass = cat.shadow || fallbackStyle.shadow;
          const icon = cat.icon || fallbackStyle.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/movies?category=${cat.slug}`)}
              aria-label={`Khám phá thể loại ${getCategoryViName({ category: cat as unknown as Parameters<typeof getCategoryViName>[0] extends { category: infer C } ? C : never })}`}
              className={[
                "group relative overflow-hidden rounded-2xl p-4 text-left cursor-pointer",
                "bg-gradient-to-br border border-white/10 backdrop-blur-md",
                colorClass,
                shadowClass,
                "h-28 sm:h-32 lg:h-36 flex flex-col justify-between",
                "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3ff]",
              ].join(" ")}
            >
              {/* Icon Emoji */}
              <div className="text-2xl sm:text-3xl select-none transition-transform duration-300 group-hover:scale-110">
                {icon}
              </div>

              {/* Tên Thể Loại tiếng Việt & Action hint */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight group-hover:text-[#00a3ff] transition-colors">
                  {typeof cat.name === "string"
                    ? cat.name
                    : cat.name?.vi || "Thể loại"}
                </h3>
                <p className="mt-0.5 text-[11px] text-white/70 font-medium">
                  Khám phá ngay →
                </p>
              </div>

              {/* Đốm sáng Ambient Glow góc dưới */}
              <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-500" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
