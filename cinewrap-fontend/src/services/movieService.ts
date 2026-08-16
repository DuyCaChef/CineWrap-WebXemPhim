import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// TypeScript Interfaces khớp với DB Prisma & DTO Back-end NestJS
// ---------------------------------------------------------------------------

export type MovieType = "SINGLE" | "SERIES";
export type MovieStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED";
export type EpisodeStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type CategoryType =
  | "GENRE"
  | "THEME"
  | "MOOD"
  | "COLLECTION"
  | "HIGHLIGHT";

export interface Category {
  id: number;
  type: CategoryType;
  slug: string;
  name: { vi: string; en?: string } | string;
  description?: { vi: string; en?: string } | string;
  icon?: string;
  color?: string;
}

// Bảng trung gian MovieCategoryRelation để liên kết nhiều-nhiều giữa Movie và Category
export interface MovieCategoryRelation {
  movieId: number;
  categoryId: number;
  category: Category;
}

// Interface cho máy chủ chứa Video (Bảng VideoServer)
export interface VideoServer {
  id: number;
  episode_id: number;
  server_name: string; // VD: "Server VIP 1", "Server Dự Phòng"
  url: string; // Link M3U8 hoặc MP4
  quality: string; // VD: "1080p", "4K"
}

export interface Episode {
  id: number;
  movie_id?: number | null;
  season_id?: number | null;
  episode_number: number;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  duration?: number | null;
  status: EpisodeStatus;
  view_count: number;
  servers?: VideoServer[];
}

export interface Season {
  id: number;
  movie_id: number;
  season_number: number;
  title?: string | null;
  episodes?: Episode[];
}

export interface Country {
  id: number;
  name: string;
  code: string;
}

// Interface Chi Tiết Bộ Phim
export interface BackendMovie {
  id: number;
  title: string;
  original_title?: string | null;
  slug: string;
  description?: string | null;
  thumbnail?: string | null;
  poster_url?: string | null;
  backdrop_url?: string | null;
  trailer_url?: string | null;
  type: MovieType;
  status: MovieStatus;
  is_vip: boolean;
  age_rating?: string | null;
  release_date?: string | null;
  release_year?: number | null;
  duration?: number | null;
  view_count: number;
  average_rating: number;
  created_at: string;
  updated_at: string;

  // Relationships từ Prisma Include
  categories?: MovieCategoryRelation[];
  countries?: Country[];
  seasons?: Season[];
  episodes?: Episode[];
}

// Thông tin phân trang trả về từ hàm findAll() của NestJS
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Struct phản hồi của API GET /movies
export interface MovieListResponse {
  data: BackendMovie[];
  meta: PaginationMeta;
}

// Tham số lọc đầu vào cho API GET /movies
export interface FilterQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: MovieStatus;
  sortBy?: "created_at" | "view_count" | "average_rating" | "release_date";
  sortOrder?: "asc" | "desc";
  type?: MovieType;
}

// ---------------------------------------------------------------------------
// Types & Interfaces cho Trình Phát Phim (Watch / Streaming)
// ---------------------------------------------------------------------------

// Struct phản hồi của API GET /episodes/public/watch/:movieSlug/episode/:episodeNumber
export interface VideoServerSource {
  id: number;
  server_name: string;
  url: string;
  quality: string;
}

export interface WatchEpisodeDetail {
  id: number;
  episode_number: number;
  title: string | null;
  slug: string | null;
  duration: number | null;
  view_count: number;
  servers: VideoServerSource[];
  movie?: {
    title: string;
    slug: string;
    poster_url: string | null;
  } | null;
  season?: {
    title: string | null;
    season_number: number;
  } | null;
}

export interface EpisodeNavigationItem {
  episode_number: number;
  slug: string | null;
}

export interface WatchEpisodeResponse {
  episode: WatchEpisodeDetail;
  navigation: {
    prev: EpisodeNavigationItem | null;
    next: EpisodeNavigationItem | null;
  };
}
// ============================================================================
// 🚀 MOVIE SERVICE API CLIENT
// ============================================================================

export const movieService = {
  /**
   * Lấy danh sách phim phân trang & lọc (Gọi API GET /movies)
   */
  async getMovies(params: FilterQueryParams = {}): Promise<MovieListResponse> {
    const response = await api.get<MovieListResponse>("/movies", {
      params: {
        page: params.page || 1,
        limit: params.limit || 24,
        keyword: params.keyword,
        status: params.status || "PUBLISHED",
        sortBy: params.sortBy || "created_at",
        sortOrder: params.sortOrder || "desc",
        type: params.type,
      },
    });
    return response.data;
  },

  /**
   * Lấy chi tiết bộ phim theo ID hoặc Slug (Gọi API GET /movies/:id)
   */
  async getMovieById(id: number | string): Promise<BackendMovie> {
    const response = await api.get<BackendMovie>(`/movies/${id}`);
    return response.data;
  },

  /**
   * Lấy danh sách Phim Xem Nhiều / Nổi Bật cho Hero Banner
   */
  async getHotMovies(limit = 5): Promise<BackendMovie[]> {
    const response = await api.get<MovieListResponse>("/movies", {
      params: {
        page: 1,
        limit,
        status: "PUBLISHED",
        sortBy: "view_count",
        sortOrder: "desc",
      },
    });
    return response.data.data;
  },

  /**
   * Lấy chi tiết bộ phim theo slug
   */
  async getMovieBySlug(slug: string): Promise<BackendMovie> {
    const response = await api.get<BackendMovie>(`/movies/slug/${slug}`);
    return response.data;
  },

  /**
   * Lấy chi tiết tập phim đang phát, danh sách server video và nút Next/Prev
   * @param movieSlug Slug của bộ phim (vd: "bon-mua-phan-2")
   * @param episodeNumber Số tập đang xem (mặc định là 1)
   */
  async getWatchEpisodeDetail(
    movieSlug: string,
    episodeNumber: number = 1,
  ): Promise<WatchEpisodeResponse> {
    // Gọi đến API NestJS: GET /episodes/public/watch/:movieSlug/episode/:episodeNumber
    const response = await api.get<WatchEpisodeResponse>(
      `/episodes/public/watch/${movieSlug}/episode/${episodeNumber}`,
    );
    return response.data;
  },

  /**
   * Gửi tín hiệu tăng lượt xem cho tập phim và phim gốc
   * @param episodeId ID của tập phim đang phát
   */
  async increaseEpisodeView(
    episodeId: number,
  ): Promise<{ success: boolean; message: string }> {
    // Gọi đến API NestJS: POST /episodes/public/:id/view
    const response = await api.post<{ success: boolean; message: string }>(
      `/episodes/public/${episodeId}/view`,
    );
    return response.data;
  },
};
