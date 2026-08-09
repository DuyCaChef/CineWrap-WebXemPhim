import type { Category } from "../services/movieService";

/**
 * Helper lấy tên Tiếng Việt của Category từ trường JSON `name` ({ vi: "...", en: "..." })
 */
export const getCategoryViName = (
  categoryRecord?: { category: Category } | null,
): string => {
  if (!categoryRecord?.category) return "Phim";
  const nameData = categoryRecord.category.name;

  if (typeof nameData === "object" && nameData !== null && "vi" in nameData) {
    return nameData.vi;
  }
  return typeof nameData === "string" ? nameData : "Phim";
};
