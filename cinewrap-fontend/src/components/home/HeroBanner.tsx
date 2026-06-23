import React, { useState } from "react";

interface HeroMovie {
  id: string;
  title: string;
  backdrop: string;
  poster: string;
  rating: string;
  genre: string;
  quality: string;
  ageRating: string;
  synopsis: string;
}

// ─── 10 MOCK DATA ĐỂ TEST HIỆU ỨNG LƯỚT ───
const HERO_MOVIES: HeroMovie[] = [
  {
    id: "hm-1",
    title: "Vực Thẳm Vô Tận",
    backdrop:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?q=80&w=400&auto=format&fit=crop",
    rating: "8.5",
    genre: "Hành động",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Một đặc vụ phải đối mặt với quá khứ của chính mình khi một âm mưu toàn cầu đe dọa lật đổ trật tự thế giới.",
  },
  {
    id: "hm-2",
    title: "Ánh Sáng Cuối Đường Hầm",
    backdrop:
      "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=400&auto=format&fit=crop",
    rating: "9.1",
    genre: "Tâm lý",
    quality: "HD 4K",
    ageRating: "16+",
    synopsis:
      "Câu chuyện cảm động về hành trình tìm lại chính mình sau biến cố lớn nhất cuộc đời.",
  },
  {
    id: "hm-3",
    title: "Thiên Hà Tan Vỡ",
    backdrop:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=400&auto=format&fit=crop",
    rating: "8.8",
    genre: "Viễn tưởng",
    quality: "HD 4K",
    ageRating: "13+",
    synopsis:
      "Phi hành đoàn cuối cùng của Trái Đất phải tìm ra ngôi nhà mới trước khi quá muộn.",
  },
  {
    id: "hm-4",
    title: "Lời Nguyền Biển Sâu",
    backdrop:
      "https://images.unsplash.com/photo-1518182170546-076616fdfaaf?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1551524164-687a55dd1126?q=80&w=400&auto=format&fit=crop",
    rating: "7.9",
    genre: "Kinh dị",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Một nhóm thám hiểm tìm thấy tàn tích cổ đại dưới đáy biển, đánh thức một thế lực đen tối ngủ yên hàng ngàn năm.",
  },
  {
    id: "hm-5",
    title: "Thành Phố Khói Bụi",
    backdrop:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop",
    rating: "8.2",
    genre: "Tội phạm",
    quality: "Full HD",
    ageRating: "16+",
    synopsis:
      "Cảnh sát chìm xâm nhập vào băng đảng nguy hiểm nhất thành phố, ranh giới giữa cái thiện và cái ác dần lu mờ.",
  },
  {
    id: "hm-6",
    title: "Kỷ Nguyên Máy Móc",
    backdrop:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=400&auto=format&fit=crop",
    rating: "9.0",
    genre: "Hành động",
    quality: "HD 4K",
    ageRating: "13+",
    synopsis:
      "Cuộc chiến sinh tồn của loài người trước cuộc nổi dậy của trí tuệ nhân tạo toàn cầu.",
  },
  {
    id: "hm-7",
    title: "Giai Điệu Mùa Thu",
    backdrop:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    rating: "8.6",
    genre: "Lãng mạn",
    quality: "HD 4K",
    ageRating: "13+",
    synopsis:
      "Hai tâm hồn cô đơn tìm thấy nhau qua niềm đam mê âm nhạc tại một thành phố thơ mộng nước Pháp.",
  },
  {
    id: "hm-8",
    title: "Chiến Binh Mùa Đông",
    backdrop:
      "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=400&auto=format&fit=crop",
    rating: "8.4",
    genre: "Phiêu lưu",
    quality: "Full HD",
    ageRating: "16+",
    synopsis:
      "Hành trình sinh tồn khắc nghiệt của một cựu chiến binh trên vùng núi tuyết hoang dã.",
  },
  {
    id: "hm-9",
    title: "Bí Ẩn Hành Tinh Đỏ",
    backdrop:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=400&auto=format&fit=crop",
    rating: "8.7",
    genre: "Khoa học",
    quality: "HD 4K",
    ageRating: "13+",
    synopsis:
      "Chuyến thám hiểm sao Hỏa đầu tiên của nhân loại đối mặt với những bí mật vượt ngoài tầm hiểu biết.",
  },
  {
    id: "hm-10",
    title: "Đế Chế Suy Tàn",
    backdrop:
      "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=400&auto=format&fit=crop",
    rating: "9.3",
    genre: "Cổ trang",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Cuộc chiến tranh giành quyền lực tàn khốc đánh dấu sự lụi tàn của một vương triều huy hoàng.",
  },
  {
    id: "hm-11",
    title: "Hung Thần Rừng Sâu",
    backdrop:
      "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=1920&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=400&auto=format&fit=crop",
    rating: "9.3",
    genre: "Cổ trang",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Cuộc chiến tranh giành quyền lực tàn khốc đánh dấu sự lụi tàn của một vương triều huy hoàng.",
  },
];

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-semibold text-cine-text backdrop-blur-sm sm:text-sm">
    {children}
  </span>
);

const HeroBanner: React.FC = () => {
  const [active, setActive] = useState(0);
  const movie = HERO_MOVIES[active];

  const goTo = (direction: "prev" | "next") => {
    setActive((prev) => {
      if (direction === "next") return (prev + 1) % HERO_MOVIES.length;
      return (prev - 1 + HERO_MOVIES.length) % HERO_MOVIES.length;
    });
  };

  return (
    <section className="relative flex flex-col justify-end min-h-[85vh] lg:min-h-[100vh] w-full overflow-hidden bg-cine-bg-primary">
      {/* Background image (giả lập trailer auto-play) */}
      <div className="absolute inset-0">
        <img
          key={movie.id}
          src={movie.backdrop}
          alt={movie.title}
          className="h-full w-full animate-[heroZoom_12s_ease-in-out_infinite_alternate] object-cover"
        />
        {/* Lớp phủ đen Gradient để Text nổi bật */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg-primary via-cine-bg-primary/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg-primary/90 via-cine-bg-primary/30 to-transparent" />
      </div>

      {/* Nút điều hướng Slide bằng Mũi Tên - Ẩn trên Mobile */}
      <button
        type="button"
        aria-label="Phim trước"
        onClick={() => goTo("prev")}
        className="group absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 lg:flex"
      >
        <svg
          className="h-6 w-6 text-cine-text transition group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Phim tiếp theo"
        onClick={() => goTo("next")}
        className="group absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 lg:flex"
      >
        <svg
          className="h-6 w-6 text-cine-text transition group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ─── PHẦN THÔNG TIN PHIM (Nằm trên dải Poster) ─── */}
      <div className="relative z-20 w-full px-4 sm:px-8 lg:px-20 pb-6 lg:pb-8 flex flex-col items-start mt-24">
        <div className="max-w-3xl">
          {/* Badge Thông Tin */}
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
            <Badge>{movie.ageRating}</Badge>
            <Badge>{movie.quality}</Badge>
            <Badge>{movie.genre}</Badge>
            <Badge>⭐ {movie.rating}</Badge>
          </div>

          {/* Tiêu đề & Tóm tắt */}
          <h1 className="text-4xl font-extrabold leading-tight text-cine-text drop-shadow-lg sm:text-5xl lg:text-7xl">
            {movie.title}
          </h1>
          <p className="mt-3 line-clamp-2 sm:line-clamp-3 max-w-2xl text-sm text-cine-text-muted sm:mt-4 sm:text-base lg:text-lg drop-shadow-md">
            {movie.synopsis}
          </p>

          {/* Các nút hành động */}
          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-cine-primary px-6 py-2.5 text-sm font-bold text-cine-bg-primary transition hover:brightness-110 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base shadow-[0_0_15px_rgba(255,193,7,0.3)]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.84A1 1 0 0 0 5 3.7v12.6a1 1 0 0 0 1.3.86l11-6.3a1 1 0 0 0 0-1.72l-11-6.3z" />
              </svg>
              Xem ngay
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-cine-text backdrop-blur-md transition hover:bg-white/20 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base"
            >
              Chi tiết
            </button>
          </div>

          {/* Chỉ báo Glassmorphism Viên thuốc */}
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-3.5 py-2.5 shadow-lg">
            {HERO_MOVIES.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                aria-label={`Chuyển đến phim ${idx + 1}`}
                onClick={() => setActive(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === active
                    ? "w-8 bg-cine-text shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── DẢI POSTER NẰM NGANG PHÍA DƯỚI CÙNG ─── */}
      <div className="relative z-20 w-full pb-6 lg:pb-10 pt-4">
        {/* Container lướt ngang (Horizontal Scroll):
          - overflow-x-auto: cho phép cuộn ngang
          - snap-x: cuộn khựng mượt
          - hide-scrollbar: ẩn thanh cuộn xấu xí  
        */}
        <div className="flex w-full items-end gap-3 pt-8 lg:gap-4 overflow-x-auto px-4 sm:px-8 lg:px-20 pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {HERO_MOVIES.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => setActive(idx)}
              className={`relative snap-center shrink-0 overflow-hidden rounded-xl cursor-pointer transition-all duration-500 ease-out origin-bottom ${
                active === idx
                  ? "w-28 sm:w-32 lg:w-40 aspect-[2/3] border-2 border-blue-50 shadow-[0_0_25px_rgba(0,0,7,0.4)] opacity-100 scale-105 -translate-y-2 z-10"
                  : "w-24 sm:w-28 lg:w-32 aspect-[2/3] border border-white/15 opacity-40 hover:opacity-80 scale-95"
              }`}
            >
              <img
                src={m.poster}
                alt={`Poster ${m.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Lớp phủ đen làm chìm các poster không active */}
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                  active === idx ? "opacity-0" : "opacity-40"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
