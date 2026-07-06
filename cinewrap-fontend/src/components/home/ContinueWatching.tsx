import React from "react";

interface ContinueItem {
  id: string;
  title: string;
  thumbnail: string;
  progress: number; // 0 - 100
  episode?: string;
}

const CONTINUE_ITEMS: ContinueItem[] = [
  {
    id: "cw-1",
    title: "Vực Thẳm Vô Tận",
    thumbnail:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop",
    progress: 70,
  },
  {
    id: "cw-2",
    title: "Biên Niên Sử Phương Bắc",
    thumbnail:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    progress: 32,
    episode: "Tập 5",
  },
  {
    id: "cw-3",
    title: "Thiên Hà Tan Vỡ",
    thumbnail:
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=800&auto=format&fit=crop",
    progress: 80,
  },
  {
    id: "cw-4",
    title: "Đêm Không Ngủ",
    thumbnail:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    progress: 15,
    episode: "Tập 2",
  },
  {
    id: "cw-5",
    title: "Lửa Và Băng",
    thumbnail:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop",
    progress: 50,
  },
];

export const ContinueWatching: React.FC = () => {
  if (CONTINUE_ITEMS.length === 0) return null;

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="block h-6 w-[3px] rounded-full bg-[#ffe600] sm:h-7"
        />
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Tiếp tục xem
        </h2>
      </div>

      <div className="-mx-4 pt-8 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:gap-4 sm:px-8 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {CONTINUE_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="group relative w-[260px] flex-shrink-0 overflow-hidden rounded-lg sm:w-[300px] lg:w-[340px]"
          >
            <div className="aspect-video w-full overflow-hidden bg-cine-surface">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-50"
              />
            </div>

            {/* Icon Play khi hover */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cine-primary/90 sm:h-16 sm:w-16">
                <svg
                  className="ml-1 h-6 w-6 text-cine-bg-primary sm:h-7 sm:w-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.84A1 1 0 0 0 5 3.7v12.6a1 1 0 0 0 1.3.86l11-6.3a1 1 0 0 0 0-1.72l-11-6.3z" />
                </svg>
              </div>
            </div>

            {/* Gradient + tiêu đề */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent pt-8">
              <div className="px-3 pb-2 text-left">
                <p className="truncate text-sm font-semibold text-cine-text sm:text-base">
                  {item.title}
                </p>
                {item.episode && (
                  <p className="text-xs text-cine-text-muted">{item.episode}</p>
                )}
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full bg-white/20">
                <div
                  className="h-full bg-cine-warn"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
