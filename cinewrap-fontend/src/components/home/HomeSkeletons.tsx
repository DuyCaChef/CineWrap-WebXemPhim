import React from "react";
import { Skeleton } from "../common/Skeleton";

// 1. Skeleton cho Hero Banner
export const HeroBannerSkeleton: React.FC = () => {
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] w-full flex-col overflow-hidden bg-cine-bg-primary pt-20">
      <div className="relative z-20 flex flex-1 flex-col justify-center px-4 sm:px-8 lg:px-20">
        <div className="max-w-3xl space-y-4">
          {/* Badge Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          {/* Title Skeleton */}
          <Skeleton className="h-12 w-3/4 sm:h-16 lg:h-20" />
          {/* Synopsis Skeleton */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          {/* Buttons Skeleton */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-28 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Horizontal Poster Carousel Skeleton */}
      <div className="relative z-20 mt-auto pb-6 pl-4 sm:pl-8 lg:pl-20">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-[2/3] w-28 flex-shrink-0 rounded-xl sm:w-32 lg:w-40"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// 2. Skeleton cho Card Phim 2:3 (NewReleases, Recommended)
export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="w-36 shrink-0 space-y-2 sm:w-44 lg:w-48">
      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};

// 3. Skeleton cho Hàng Phim Cuộn Ngang (Section Row)
export const MovieSectionSkeleton: React.FC = () => {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-1 rounded-full" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
};

// 4. Skeleton cho Wide Card Phim Bộ (TopSeries)
export const SeriesCardSkeleton: React.FC = () => {
  return (
    <div className="flex w-full items-stretch gap-4 rounded-2xl bg-slate-900/60 p-4">
      <Skeleton className="aspect-[2/3] h-28 rounded-xl sm:h-32 lg:h-36" />
      <div className="flex flex-1 flex-col justify-center space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-4 w-1/3 pt-2" />
      </div>
    </div>
  );
};
