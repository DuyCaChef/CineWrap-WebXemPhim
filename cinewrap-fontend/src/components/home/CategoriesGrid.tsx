import React from "react";

// TODO: Section 5 - Thể Loại (Categories/Genres)
// - Bento Grid tĩnh, hình nền minh họa mờ/darken
// - Text tên thể loại trong khối kính mờ (backdrop-blur-md bg-white/10)
// Sẽ được code chi tiết ở câu trả lời tiếp theo.

const CategoriesGrid: React.FC = () => {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
      <h2 className="text-lg font-bold text-cine-text sm:text-xl lg:text-2xl">
        Thể loại
      </h2>
      <div className="mt-4 text-sm text-cine-text-muted">
        {/* Placeholder - đang chờ triển khai chi tiết */}
      </div>
    </section>
  );
};

export default CategoriesGrid;
