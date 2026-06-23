import React, { useState, useEffect } from "react";

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
    title: "Peaky Blinders: Trỗi Dậy Của Băng Đảng",
    backdrop:
      "https://i.pinimg.com/1200x/7e/0d/f0/7e0df08da300bc6e9b6ddb101b6349d5.jpg",
    poster:
      "https://i.pinimg.com/736x/76/07/ee/7607ee8bd1916c561ea0cd55ea95dff0.jpg",
    rating: "8.5",
    genre: "Hành động",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Hành trình bành trướng nghẹt thở của băng đảng nhà Shelby dưới sự dẫn dắt của thủ lĩnh thiên tài, đầy tham vọng Tommy Shelby — biến một gia tộc tội phạm đường phố thành một đế chế thống trị cả thế giới ngầm lẫn chính trường.",
  },
  {
    id: "hm-2",
    title: "One Piece Movie",
    backdrop:
      "https://i.pinimg.com/1200x/d7/50/71/d7507190bf4f9811d42cdad85f8f7a52.jpg",
    poster:
      "https://i.pinimg.com/originals/fd/72/86/fd7286c435a370ac00dee8410ed15a7c.jpg",
    rating: "9.1",
    genre: "Phiêu lưu",
    quality: "HD 4K",
    ageRating: "16+",
    synopsis:
      "Câu chuyện cảm động về hành trình tìm lại chính mình sau biến cố lớn nhất cuộc đời.Bước vào một hòn đảo kỳ bí hoàn toàn mới trên Đại Hải Trình, băng Mũ Rơm phải đối đầu với những kẻ thù nguy hiểm trong quá khứ lẫn thế hệ mới. Những thế lực mạnh nhất hội tụ, đẩy Luffy và đồng đội vào thử thách sống còn để bảo vệ đồng đội và kho báu lớn nhất.",
  },
  {
    id: "hm-3",
    title: "Interstellar",
    backdrop:
      "https://i.pinimg.com/originals/23/af/5f/23af5fadb6399c522676d2e87236a2ba.jpg",
    poster:
      "https://i.pinimg.com/1200x/a3/19/69/a319697386c13cc6d64dff5797de9f5d.jpg",
    rating: "8.8",
    genre: "Viễn tưởng",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Một nhóm các nhà thám hiểm không gian vũ trụ phải thực hiện chuyến hành trình nguy hiểm nhất lịch sử nhân loại: bước qua một hố đen vũ trụ để tìm kiếm một hành tinh mới, cứu lấy tương lai của loài người. Đó không chỉ là cuộc chiến với sự bao la của vũ trụ, mà còn là cuộc chiến với thời gian để trở về với gia đình.",
  },
  {
    id: "hm-4",
    title: "Mắt biếc",
    backdrop:
      "https://i.pinimg.com/1200x/00/12/ae/0012aead8778ab2fb3446d1b38d84ba1.jpg",
    poster:
      "https://i.pinimg.com/1200x/69/8f/ed/698fed9182e1a389a005be886aff68fe.jpg",
    rating: "7.9",
    genre: "Tình cảm",
    quality: "HD 4K",
    ageRating: "18+",
    synopsis:
      "Câu chuyện tình đơn phương kéo dài cả đời người của Ngạn dành cho Hà Lan – cô gái có đôi mắt đẹp như bầu trời. Một bản tình ca buồn về sự lỡ làng, những nuối tiếc thanh xuân và ký ức về một thời đã xa chẳng thể nào quay lại.",
  },
  {
    id: "hm-5",
    title: "Đất rừng Phương Nam",
    backdrop:
      "https://i.pinimg.com/1200x/b5/8c/32/b58c32a352af3e2681c9c3bf1958a774.jpg",
    poster:
      "https://i.pinimg.com/1200x/ee/7a/0b/ee7a0b36bffdccb84c43d841ebf49a76.jpg",
    rating: "10.0",
    genre: "Chiến tranh",
    quality: "Full HD",
    ageRating: "16+",
    synopsis:
      "Theo chân cậu bé An trong cuộc phiêu lưu ly tán để tìm lại người cha của mình. Trên hành trình gian nan đó, An được chở che bởi tình yêu thương của những người dân Nam Bộ chất phác, kiên cường, và chứng kiến dòng chảy lịch sử hào hùng của một thế hệ đứng lên bảo vệ quê hương.",
  },
  {
    id: "hm-6",
    title: "Bố Già",
    backdrop:
      "https://i.pinimg.com/1200x/c3/60/59/c3605982d92fcc02198218a20561bee0.jpg",
    poster:
      "https://i.pinimg.com/1200x/bf/59/43/bf5943093d7a281cc12e331a62241afa.jpg",
    rating: "9.0",
    genre: "Gia đình",
    quality: "HD 4K",
    ageRating: "13+",
    synopsis:
      "Xoay quanh cuộc đời của ông Ba Sang – một người cha nghèo khó, bao đồng, luôn hết lòng hy sinh vì người thân nhưng lại không biết cách thể hiện tình cảm khiến những mâu thuẫn thế hệ nảy sinh. Một lát cắt chân thực, chạm đến trái tim về sự hy sinh, nỗi đau và sợi dây gắn kết gia đình khó xóa nhòa.",
  },
  {
    id: "hm-7",
    title: "BatMan",
    backdrop:
      "https://i.pinimg.com/1200x/33/c4/94/33c494a1a55a2d8e03e34dc7fc5cac1f.jpg",
    poster:
      "https://i.pinimg.com/736x/ab/3d/63/ab3d6358c7ee93923de8caec086aa259.jpg",
    rating: "8.6",
    genre: "Siêu anh hùng",
    quality: "HD 4K",
    ageRating: "16+",
    synopsis:
      "Trong đêm tối Gotham, một người đàn ông mặc áo choàng và mặt nạ dơi chiến đấu chống lại tội ác, bảo vệ thành phố khỏi những kẻ xấu xa. Batman không chỉ là biểu tượng của công lý mà còn là hiện thân của sự hy sinh và quyết tâm không ngừng nghỉ để bảo vệ những người vô tội.",
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

  // Khi `active` thay đổi, cuộn poster tương ứng vào giữa vùng nhìn thấy của container
  useEffect(() => {
    const activePoster = document.getElementById(`poster-${active}`);
    if (activePoster) {
      activePoster.scrollIntoView({
        behavior: "smooth", // Cuộn mượt mà
        inline: "center", // Đưa poster ra giữa vùng nhìn thấy
        block: "nearest", // QUAN TRỌNG: Tránh làm giật/cuộn dọc cả trang web
      });
    }
  }, [active]);

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
        className="group absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 md:flex"
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
        className="group absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 backdrop-blur-md transition hover:bg-black/50 md:flex"
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
      <div className="relative z-20 w-full pb-6 lg:pb-10">
        {/* Container lướt ngang (Horizontal Scroll):
          - overflow-x-auto: cho phép cuộn ngang
          - snap-x: cuộn khựng mượt
          - hide-scrollbar: ẩn thanh cuộn xấu xí  
        */}
        <div className="flex w-full items-end gap-3 pt-8 lg:gap-4 overflow-x-auto px-4 sm:px-8 lg:px-20 pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {HERO_MOVIES.map((m, idx) => (
            <div
              key={m.id}
              id={`poster-${idx}`} // ID để scrollIntoView
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
