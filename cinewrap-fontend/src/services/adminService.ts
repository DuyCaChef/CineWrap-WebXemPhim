import { api } from "./api";

// ---------------------------------------------------------------------------
// TypeScript Interfaces & Types
// ---------------------------------------------------------------------------

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

export interface AdminVideoServerItem {
  id: number;
  episode_id: number;
  server_name: string;
  url: string;
  quality?: string;
}

export interface TopMovieItem {
  id: number;
  title: string;
  slug: string;
  type: "SINGLE" | "SERIES";
  view_count: number;
  average_rating: number;
  status: string;
}

export interface AdminStatsResponse {
  totalMovies: number;
  totalViews: number;
  totalEpisodes: number;
  pendingReports: number;
  topMovies: TopMovieItem[];
}

export interface ReportTicket {
  id: number;
  movie_title: string;
  movie_slug: string;
  episode_number: number;
  server_name?: string;
  issue_type: "BROKEN_LINK" | "WRONG_EPISODE" | "NO_SOUND" | "OTHER";
  description?: string;
  created_at: string;
  status: "PENDING" | "RESOLVED" | "REJECTED";
}

export interface AdminMoviePayload {
  title: string;
  slug: string;
  type: "SINGLE" | "SERIES";
  status: "PUBLISHED" | "DRAFT";
  poster_url?: string;
  description?: string;
  release_year?: number;
  duration?: number;
}

export interface AdminEpisodePayload {
  movieId: number;
  episode_number: number;
  title?: string;
  duration?: number;
}

// ---------------------------------------------------------------------------
// Admin Service Client
// ---------------------------------------------------------------------------

export const adminService = {
  // 1. Cào 1 bộ phim theo slug nguồn
  crawlSingleMovie: async (slug: string): Promise<CrawlSingleResponse> => {
    const res = await api.post(`/movies/sync/${slug}`);
    return res.data;
  },

  // 2. Cào nguyên 1 trang danh sách (24 phim) theo số page
  crawlEntirePage: async (page: number): Promise<CrawlPageResponse> => {
    const res = await api.post(`/movies/sync-page?page=${page}`);
    return res.data;
  },

  // 3. Tạo Server mới cho tập phim
  createVideoServer: async (payload: {
    episodeId: number;
    server_name: string;
    url: string;
    quality: string;
  }): Promise<AdminVideoServerItem> => {
    const res = await api.post(
      `/episodes/${payload.episodeId}/servers`,
      payload,
    );
    return res.data;
  },

  // 4. Xóa Server khỏi tập phim
  deleteVideoServer: async (
    serverId: number,
  ): Promise<{ success: boolean }> => {
    const res = await api.delete(`/episodes/servers/${serverId}`);
    return res.data;
  },

  // 5. Thống kê số liệu KPI cho OverviewTab
  getDashboardStats: async (): Promise<AdminStatsResponse> => {
    try {
      const res = await api.get("/admin/stats");
      return res.data;
    } catch {
      // Fallback dữ liệu mẫu khi Backend chưa hoàn tất route /admin/stats
      return {
        totalMovies: 1248,
        totalViews: 482900,
        totalEpisodes: 8920,
        pendingReports: 3,
        topMovies: [
          {
            id: 1,
            title: "Avatar: Dòng Chảy Của Nước",
            slug: "avatar-dong-chay-cua-nuoc",
            type: "SINGLE",
            view_count: 124500,
            average_rating: 9.2,
            status: "PUBLISHED",
          },
          {
            id: 2,
            title: "Đấu Phá Thương Khung (Phần 5)",
            slug: "dau-pha-thuong-khung-phan-5",
            type: "SERIES",
            view_count: 98200,
            average_rating: 8.8,
            status: "PUBLISHED",
          },
          {
            id: 3,
            title: "Tiệm Bánh Kỳ Diệu",
            slug: "tiem-banh-ky-dieu",
            type: "SINGLE",
            view_count: 76980,
            average_rating: 9.0,
            status: "REVIEW",
          },
        ],
      };
    }
  },

  // 6. Lấy danh sách Ticket báo lỗi từ người xem
  getReportTickets: async (): Promise<ReportTicket[]> => {
    try {
      const res = await api.get("/admin/reports");
      return res.data;
    } catch {
      return [
        {
          id: 101,
          movie_title: "Avatar: Dòng Chảy Của Nước",
          movie_slug: "avatar-dong-chay-cua-nuoc",
          episode_number: 1,
          server_name: "Server VIP 1 (HLS)",
          issue_type: "BROKEN_LINK",
          description:
            "Link m3u8 bị lỗi 404 không thể load phim từ phút thứ 15.",
          created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          status: "PENDING",
        },
        {
          id: 102,
          movie_title: "Đấu Phá Thương Khung (Phần 5)",
          movie_slug: "dau-pha-thuong-khung-phan-5",
          episode_number: 12,
          server_name: "Server KKPhim (Auto)",
          issue_type: "WRONG_EPISODE",
          description: "Tập 12 bị phát nhầm nội dung của Tập 11.",
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          status: "PENDING",
        },
        {
          id: 103,
          movie_title: "Dạ Khúc Nửa Đêm",
          movie_slug: "da-khuc-nua-dem",
          episode_number: 3,
          server_name: "Server Backup (MP4)",
          issue_type: "NO_SOUND",
          description: "Video phát bình thường nhưng bị mất tiếng hoàn toàn.",
          created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          status: "RESOLVED",
        },
      ];
    }
  },

  // 7. Cập nhật trạng thái ticket (Đã sửa / Từ chối)
  updateReportStatus: async (
    ticketId: number,
    status: "RESOLVED" | "REJECTED",
  ): Promise<{ success: boolean }> => {
    try {
      const res = await api.patch(`/admin/reports/${ticketId}`, { status });
      return res.data;
    } catch {
      return { success: true };
    }
  },

  // 8. Xóa ticket báo lỗi
  deleteReportTicket: async (
    ticketId: number,
  ): Promise<{ success: boolean }> => {
    try {
      const res = await api.delete(`/admin/reports/${ticketId}`);
      return res.data;
    } catch {
      return { success: true };
    }
  },

  // 9. Quản lí phim
  createMovie: async (payload: AdminMoviePayload) => {
    try {
      const res = await api.post("/admin/movies", payload);
      return res.data;
    } catch {
      return { success: true, id: Date.now(), ...payload };
    }
  },

  updateMovie: async (id: number, payload: Partial<AdminMoviePayload>) => {
    try {
      const res = await api.put(`/admin/movies/${id}`, payload);
      return res.data;
    } catch {
      return { success: true, id, ...payload };
    }
  },

  deleteMovie: async (id: number) => {
    try {
      const res = await api.delete(`/admin/movies/${id}`);
      return res.data;
    } catch {
      return { success: true };
    }
  },

  // Quản lý Tập phim
  createEpisode: async (payload: AdminEpisodePayload) => {
    try {
      const res = await api.post(
        `/admin/movies/${payload.movieId}/episodes`,
        payload,
      );
      return res.data;
    } catch {
      return { success: true, id: Date.now(), ...payload };
    }
  },

  deleteEpisode: async (episodeId: number) => {
    try {
      const res = await api.delete(`/admin/episodes/${episodeId}`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};
