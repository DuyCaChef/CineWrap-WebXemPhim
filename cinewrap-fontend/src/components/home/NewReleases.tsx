import React from "react";

// TODO: Section 3 - Phim Mới (New Releases)
// - Horizontal scroll slider, poster dọc 2:3, rounded-xl
// - Hover: -translate-y-2 + glow shadow cine-secondary (#00a3ff)
// - Nút "Xem tất cả" ở tiêu đề
// Sẽ được code chi tiết ở câu trả lời tiếp theo.

const NewReleases: React.FC = () => {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
      <h2 className="text-lg font-bold text-cine-text sm:text-xl lg:text-2xl">
        Phim mới
      </h2>
      <div className="mt-4 text-sm text-cine-text-muted">
        {/* Placeholder - đang chờ triển khai chi tiết */}
      </div>
    </section>
  );
};

export default NewReleases;
