import React from "react";

// TODO: Section 7 - Top Series (Phim bộ đình đám)
// - Wide card: trái = poster nhỏ, phải = tiêu đề + tóm tắt ngắn + số Mùa/Tập
// - Badge góc thẻ "Tập mới" / "Trọn bộ" (cine-warn / cine-primary)
// Sẽ được code chi tiết ở câu trả lời tiếp theo.

const TopSeries: React.FC = () => {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
      <h2 className="text-lg font-bold text-cine-text sm:text-xl lg:text-2xl">
        Top series
      </h2>
      <div className="mt-4 text-sm text-cine-text-muted">
        {/* Placeholder - đang chờ triển khai chi tiết */}
      </div>
    </section>
  );
};

export default TopSeries;
