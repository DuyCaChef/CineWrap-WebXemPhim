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

import {
  HeroBannerSkeleton,
  MovieSectionSkeleton,
  SeriesSectionSkeleton,
} from "../components/home/HomeSkeletons";

// Import Service gọi API và Kiểu dữ liệu BackendMovie
import { movieService } from "../services/movieService";
import type { BackendMovie } from "../services/movieService";

export const HomePage: React.FC = () => {
  // Quản lý trạng thái loading & dữ liệu thực tế từ NestJS
  const [isLoading, setIsLoading] = useState(true);
  const [heroMovies, setHeroMovies] = useState<BackendMovie[]>([]);
  const [latestMovies, setLatestMovies] = useState<BackendMovie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<BackendMovie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<BackendMovie[]>([]);

  useEffect(() => {
    // Ép cuộn lên đỉnh khi vừa vào trang
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    let isMounted = true; // Cờ chặn memory leak khi unmount

    const fetchHomeData = async () => {
      try {
        setIsLoading(true);

        // Gọi đồng thời các API để phủ đầy dữ liệu cho các khối giao diện
        const [hotData, latestRes, topRatedRes, seriesRes] = await Promise.all([
          movieService.getHotMovies(5), // Top 5 phim xem nhiều cho Hero Banner
          movieService.getMovies({
            page: 1,
            limit: 12,
            sortBy: "created_at",
            sortOrder: "desc",
          }), // Phim mới cập nhật
          movieService.getMovies({
            page: 1,
            limit: 10,
            sortBy: "view_count",
            sortOrder: "desc",
          }), // Top Bảng xếp hạng
          movieService.getMovies({ page: 1, limit: 10, type: "SERIES" }), // Phim bộ nổi bật
        ]);

        if (isMounted) {
          setHeroMovies(hotData || []);
          setLatestMovies(latestRes?.data || []);
          setTopRatedMovies(topRatedRes?.data || []);
          setSeriesMovies(seriesRes?.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi kết nối API NestJS:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-cine-bg-primary font-sans text-cine-text">
        <Header />
        <HeroBannerSkeleton />
        <MovieSectionSkeleton />
        <SeriesSectionSkeleton />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-cine-bg-primary font-sans text-cine-text">
      {/* Header */}
      <Header />

      {/* 1. Hero Banner: Truyền danh sách phim Hot */}
      <HeroBanner movies={heroMovies} />

      {/* 2. Tiếp tục xem */}
      <ContinueWatching />

      {/* 3. Phim mới cập nhật */}
      <NewReleases movies={latestMovies} />

      {/* 4. Bảng xếp hạng Top Movies */}
      <TopMovies movies={topRatedMovies} />

      {/* 5. Thể loại Phim */}
      <CategoriesGrid />

      {/* 6. Có thể bạn sẽ thích (Phim đề xuất) */}
      <Recommended movies={latestMovies} />

      {/* 7. Top Series (Phim bộ) */}
      <TopSeries movies={seriesMovies} />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default HomePage;
