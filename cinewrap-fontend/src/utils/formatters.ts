/**
 * Helper lấy tên Tiếng Việt của Category an toàn tuyệt đối 100%
 * Nhận linh hoạt: object lồng { category: ... }, Category thuần, chuỗi string hoặc null/undefined
 */
export const getCategoryViName = (categoryInput?: unknown): string => {
  if (!categoryInput) return "Phim";

  // Nếu truyền trực tiếp chuỗi tên string
  if (typeof categoryInput === "string") {
    return categoryInput.trim() || "Phim";
  }

  if (typeof categoryInput !== "object") return "Phim";

  // 1. Tự động bóc tách nếu truyền dạng bọc { category: { name: ... } }
  const target: object =
    "category" in categoryInput &&
    categoryInput.category &&
    typeof categoryInput.category === "object"
      ? (categoryInput.category as object)
      : categoryInput;

  // 2. Kiểm tra thuộc tính name
  if (!("name" in target) || !target.name) {
    return "Phim";
  }

  const nameData = (target as { name: unknown }).name;

  // 3. Bóc tách tên Tiếng Việt từ JSON đa ngôn ngữ { vi: "..." } hoặc string
  if (typeof nameData === "object" && nameData !== null && "vi" in nameData) {
    const viName = (nameData as { vi?: unknown }).vi;
    return typeof viName === "string" && viName.trim() ? viName : "Phim";
  }

  return typeof nameData === "string" && nameData.trim() ? nameData : "Phim";
};
