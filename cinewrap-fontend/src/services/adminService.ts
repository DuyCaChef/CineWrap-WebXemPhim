import { api } from "./api";

export interface CrawlSingleResponse {
  success: boolean;
  message: string;
  movie?: {
    id: number;
    title: string;
    slug: string;
    total_episodes?: number;
  };
}

export interface CrawlPageResponse {
  success: boolean;
  message: string;
  totalSynced?: number;
  results?: Array<{
    slug: string;
    status: "SUCCESS" | "FAILED";
    title?: string;
    error?: string;
  }>;
}

export const adminService = {
  // Cào 1 bộ phim theo slug nguồn
  crawlSingleMovie: async (slug: string): Promise<CrawlSingleResponse> => {
    const res = await api.post(`/movies/sync/${slug}`);
    return res.data;
  },

  // Cào nguyên 1 trang danh sách (24 phim) theo số page
  crawlEntirePage: async (page: number): Promise<CrawlPageResponse> => {
    const res = await api.post(`/movies/sync-page?page=${page}`);
    return res.data;
  },
};
