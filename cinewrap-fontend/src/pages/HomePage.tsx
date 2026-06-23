import React from "react";
import Header from "../components/Header";
import HeroBanner from "../components/home/HeroBanner";
import ContinueWatching from "../components/home/ContinueWatching";
import NewReleases from "../components/home/NewReleases";
import TopMovies from "../components/home/TopMovies";
import CategoriesGrid from "../components/home/CategoriesGrid";
import Recommended from "../components/home/Recommended";
import TopSeries from "../components/home/TopSeries";

const HomePage: React.FC = () => {
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
    </main>
  );
};

export default HomePage;
