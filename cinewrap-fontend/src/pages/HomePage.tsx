import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { HeroBanner } from "../components/home/HeroBanner";
import { ContinueWatching } from "../components/home/ContinueWatching";
import { NewReleases } from "../components/home/NewReleases";
import { TopMovies } from "../components/home/TopMovies";
import { CategoriesGrid } from "../components/home/CategoriesGrid";
import { Recommended } from "../components/home/Recommended";
import { TopSeries } from "../components/home/TopSeries";
import { Footer } from "../components/Footer";
// Bỏ bớt MovieCardSkeleton và SeriesCardSkeleton dư thừa
import {
  HeroBannerSkeleton,
  MovieSectionSkeleton,
} from "../components/home/HomeSkeletons";

const HomePage: React.FC = () => {
  // State để quản lý trạng thái loading của trang
  const [isLoading, setIsLoading] = useState(true);

  // 1. useEffect CHỈ DÙNG ĐỂ xử lý side-effects (cuộn trang & hẹn giờ API)
  useEffect(() => {
    // Ép cuộn lên đỉnh khi vừa vào trang
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Giả lập thời gian load dữ liệu từ API (1.5 giây)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Cleanup timer khi component unmount
    return () => clearTimeout(timer);
  }, []); // Mảng rỗng [] chạy 1 lần duy nhất khi mount

  // 2. CHUYỂN CÂU LỆNH IF RỜI KHỎI useEffect VỀ BÊN NGOÀI COMPONENT BODY
  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-cine-bg-primary font-sans text-cine-text">
        <Header />
        <HeroBannerSkeleton />
        <MovieSectionSkeleton />
        <MovieSectionSkeleton />
        <Footer />
      </main>
    );
  }

  // 3. Render giao diện chính khi đã load dữ liệu xong
  return (
    <main className="min-h-screen w-full bg-cine-bg-primary font-sans text-cine-text">
      {/* Header */}
      <Header />

      <div className="pt-20"></div>

      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Tiếp tục xem */}
      <ContinueWatching />

      {/* 3. Phim mới */}
      <NewReleases />

      {/* 4. Top movies */}
      <TopMovies />

      {/* 5. Thể loại */}
      <CategoriesGrid />

      {/* 6. Có thể bạn sẽ thích */}
      <Recommended />

      {/* 7. Top series */}
      <TopSeries />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default HomePage;
