import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Prisma, MovieStatus, MovieType } from '@prisma/client';

// ====================================================================
// 🌟 INTERFACES ĐỊNH KIỂU DỮ LIỆU NGUỒN CHUẨN XÁC KHỚP VỚI API OPHIM
// ====================================================================
interface OphimCategory {
  name: string;
  slug: string;
}

interface OphimEpisode {
  name: string;
  slug: string;
  link_m3u8: string;
}

interface OphimMovie {
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  thumb_url: string;
  type: 'single' | 'series';
  time: string;
  category: OphimCategory[];
}

interface OphimDetailResponse {
  status: boolean;
  movie: OphimMovie;
  episodes: Array<{ server_data: OphimEpisode[] }>;
}

interface OphimListItemSource {
  name: string;
  slug: string;
}

interface OphimListResponse {
  status: boolean;
  items: OphimListItemSource[];
}

interface SyncReportItem {
  title: string;
  slug: string;
  status: 'Thành công' | 'Thất bại';
  total_episodes?: number;
  reason?: string;
}

@Injectable()
export class MoviesService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  // ================== [MỚI 1] HÀM LÕI: CÀO VÀ ĐỒNG BỘ CHI TIẾT 1 BỘ PHIM ==================
  async crawlAndSyncFromSource(slug: string) {
    const detailApiUrl = `https://phimapi.com/phim/${slug}`;

    const response = await firstValueFrom(
      this.httpService.get<OphimDetailResponse>(detailApiUrl),
    );
    const rawData = response.data;

    if (!rawData || !rawData.movie) {
      throw new NotFoundException(`Không tìm thấy dữ liệu cho phim: ${slug}`);
    }

    const { movie, episodes } = rawData;
    const serverData = episodes?.[0]?.server_data || [];

    // 1. XỬ LÝ THỂ LOẠI
    const categoryIds: number[] = [];
    if (Array.isArray(movie.category)) {
      for (const cat of movie.category) {
        const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
        const nameJson = { vi: cat.name } as unknown as Prisma.InputJsonValue;

        const categoryRecord = await this.prisma.category.upsert({
          where: { slug: catSlug },
          update: {},
          create: { name: nameJson, slug: catSlug },
        });
        categoryIds.push(categoryRecord.id);
      }
    }

    const durationNum = parseInt(movie.time.split(' ')[0], 10) || null;
    const computedType =
      movie.type === 'single' ? MovieType.SINGLE : MovieType.SERIES;

    // 2. LƯU HOẶC CẬP NHẬT PHIM (MOVIE UPSERT)
    // 💡 BỔ SUNG: Sửa status thành PUBLISHED để cào về là chiếu lên Web luôn
    const savedMovie = await this.prisma.movie.upsert({
      where: { slug: movie.slug },
      update: {
        title: movie.name,
        original_title: movie.origin_name,
        description: movie.content,
        poster_url: movie.thumb_url,
        type: computedType,
        duration: durationNum,
        categories: {
          deleteMany: {},
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
      },
      create: {
        title: movie.name,
        slug: movie.slug,
        original_title: movie.origin_name,
        description: movie.content,
        poster_url: movie.thumb_url,
        type: computedType,
        status: MovieStatus.PUBLISHED, // 💡 BỔ SUNG Ở ĐÂY
        duration: durationNum,
        categories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
      },
    });

    // =========================================================
    // 💡 BỔ SUNG LOGIC SEASON (PHẦN PHIM) DÀNH RIÊNG CHO PHIM BỘ
    // =========================================================
    let activeSeasonId: number | null = null;

    if (computedType === MovieType.SERIES) {
      // Vì API nguồn không cung cấp tên Phần, ta tự động tạo "Phần 1"
      const defaultSeason = await this.prisma.season.upsert({
        where: {
          // Ràng buộc 1 bộ phim có 1 Phần 1
          movie_id_season_number: { movie_id: savedMovie.id, season_number: 1 },
        },
        update: {},
        create: {
          movie_id: savedMovie.id,
          season_number: 1,
          title: 'Phần 1',
        },
      });
      activeSeasonId = defaultSeason.id;
    }

    // 3. XỬ LÝ ĐỔ DANH SÁCH TẬP PHIM HÀNG LOẠT

    // Xóa tập cũ để tránh trùng lặp khi cào lại
    console.log(
      `Đang chuẩn bị lưu ${serverData.length} tập phim cho phim: ${savedMovie.title}`,
    );
    console.log('Dữ liệu tập 1 trông như thế này:', serverData[0]);
    if (computedType === MovieType.SERIES && activeSeasonId) {
      await this.prisma.episode.deleteMany({
        where: { season_id: activeSeasonId },
      });
    } else {
      await this.prisma.episode.deleteMany({
        where: { movie_id: savedMovie.id },
      });
    }

    // Đổ tập mới vào
    if (serverData.length > 0) {
      await this.prisma.episode.createMany({
        data: serverData.map((ep, index) => ({
          // 💡 ĐIỀU HƯỚNG THÔNG MINH:
          // Nếu là phim lẻ -> Nhét vào movie_id.
          // Nếu là phim bộ -> movie_id = null, nhét vào season_id.
          movie_id: computedType === MovieType.SINGLE ? savedMovie.id : null,
          season_id: activeSeasonId,

          episode_number: index + 1,
          title: ep.name,
          slug: ep.slug,
          // video_url: ep.link_m3u8,
          status: 'PUBLISHED', // 💡 MỞ KHÓA API EPISODES: Cào về là hiện lên public luôn
        })),
      });
    }

    return {
      movie_id: savedMovie.id,
      title: savedMovie.title,
      total_episodes: serverData.length,
    };
  }

  // ================== [MỚI 2] HÀM ĐỒNG BỘ CÔNG NGHIỆP: CÀO HÀNG LOẠT THEO TRANG ==================
  async syncEntirePageFromSource(pageNumber: number) {
    // const listApiUrl = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${pageNumber}`;
    const listApiUrl = ` https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${pageNumber}`;
    console.log(
      `🚀 KÍCH HOẠT BOT CÀO PHIM: Đang quét danh sách trang số ${pageNumber}...`,
    );

    try {
      const response = await firstValueFrom(
        this.httpService.get<OphimListResponse>(listApiUrl),
      );
      const rawData = response.data;

      if (!rawData || !rawData.items || rawData.items.length === 0) {
        throw new NotFoundException(
          `Không tìm thấy phim tại trang ${pageNumber}`,
        );
      }

      const movieItems = rawData.items;
      const syncReports: SyncReportItem[] = [];

      for (const item of movieItems) {
        try {
          const result = await this.crawlAndSyncFromSource(item.slug);
          syncReports.push({
            title: item.name,
            slug: item.slug,
            status: 'Thành công',
            total_episodes: result.total_episodes,
          });
        } catch (error) {
          const errMsg =
            error instanceof Error ? error.message : 'Lỗi không xác định';
          syncReports.push({
            title: item.name,
            slug: item.slug,
            status: 'Thất bại',
            reason: errMsg,
          });
        }
      }

      return {
        message: `Hoàn tất đồng bộ trang ${pageNumber}!`,
        total_movies_processed: movieItems.length,
        success_count: syncReports.filter((r) => r.status === 'Thành công')
          .length,
        failed_count: syncReports.filter((r) => r.status === 'Thất bại').length,
        reports: syncReports,
      };
    } catch {
      throw new BadRequestException(
        `Không thể đồng bộ dữ liệu trang số ${pageNumber}. Server nguồn lỗi.`,
      );
    }
  }

  // ================== CÁC HÀM CRUD GỐC CỦA BẠN GIỮ NGUYÊN VẸN 100% ==================
  private async validateCategoriesExist(categoryIds: number[]) {
    if (!categoryIds || categoryIds.length === 0) return;
    const existingCategories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });
    if (existingCategories.length !== categoryIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều ID Thể loại không tồn tại trong hệ thống.',
      );
    }
  }

  async create(createMovieDto: CreateMovieDto) {
    const {
      categoryIds,
      releaseDate,
      originalTitle,
      posterUrl,
      backdropUrl,
      synopsis,
      ...movieData
    } = createMovieDto;
    const existingMovie = await this.prisma.movie.findUnique({
      where: { slug: movieData.slug },
    });
    if (existingMovie)
      throw new ConflictException(
        'Slug phim đã tồn tại, vui lòng chọn slug khác.',
      );

    const parsedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds.map(Number)
      : [];
    await this.validateCategoriesExist(parsedCategoryIds);

    return this.prisma.movie.create({
      data: {
        ...movieData,
        description: synopsis,
        original_title: originalTitle || null,
        poster_url: posterUrl || null,
        backdrop_url: backdropUrl || null,
        release_date: releaseDate ? new Date(releaseDate) : null,
        categories: {
          create: parsedCategoryIds.map((id) => ({ categoryId: id })),
        },
      },
      include: { categories: { include: { category: true } } },
    });
  }

  async findAll(
    page: number,
    limit: number,
    keyword?: string,
    status?: MovieStatus,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;
    const whereCondition: Prisma.MovieWhereInput = {};
    if (keyword) {
      whereCondition.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { original_title: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (status) whereCondition.status = status;
    const orderByCondition = {
      [sortBy]: sortOrder,
    } as Prisma.MovieOrderByWithRelationInput;

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: { categories: { include: { category: true } } },
        orderBy: orderByCondition,
      }),
      this.prisma.movie.count({ where: whereCondition }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        seasons: { include: { episodes: true } },
        episodes: true,
      },
    });
    if (!movie) throw new NotFoundException('Không tìm thấy bộ phim này.');
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const {
      categoryIds,
      releaseDate,
      originalTitle,
      posterUrl,
      backdropUrl,
      synopsis,
      ...movieData
    } = updateMovieDto;
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie)
      throw new NotFoundException('Không tìm thấy bộ phim này để cập nhật.');

    if (movieData.slug && movieData.slug !== movie.slug) {
      const existingSlug = await this.prisma.movie.findUnique({
        where: { slug: movieData.slug },
      });
      if (existingSlug)
        throw new ConflictException('Slug phim mới đã tồn tại trên hệ thống.');
    }

    const parsedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds.map(Number)
      : undefined;
    if (parsedCategoryIds)
      await this.validateCategoriesExist(parsedCategoryIds);

    return this.prisma.movie.update({
      where: { id },
      data: {
        title: movieData.title !== undefined ? movieData.title : movie.title,
        slug: movieData.slug !== undefined ? movieData.slug : movie.slug,
        description: synopsis !== undefined ? synopsis : movie.description,
        type: movieData.type !== undefined ? movieData.type : movie.type,
        status:
          movieData.status !== undefined ? movieData.status : movie.status,
        duration:
          movieData.duration !== undefined
            ? movieData.duration
            : movie.duration,
        original_title:
          originalTitle !== undefined
            ? (originalTitle as string | null)
            : movie.original_title,
        poster_url:
          posterUrl !== undefined
            ? (posterUrl as string | null)
            : movie.poster_url,
        backdrop_url:
          backdropUrl !== undefined
            ? (backdropUrl as string | null)
            : movie.backdrop_url,
        release_date: releaseDate ? new Date(String(releaseDate)) : undefined,
        categories: parsedCategoryIds
          ? {
              deleteMany: {},
              create: parsedCategoryIds.map((catId) => ({ categoryId: catId })),
            }
          : undefined,
      },
      include: { categories: { include: { category: true } } },
    });
  }

  async remove(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('Không tìm thấy bộ phim này.');
    await this.prisma.movie.update({
      where: { id },
      data: { status: MovieStatus.ARCHIVED },
    });
    return {
      message: `Đã đưa phim "${movie.title}" vào lưu trữ (Soft Delete) thành công.`,
    };
  }
}
