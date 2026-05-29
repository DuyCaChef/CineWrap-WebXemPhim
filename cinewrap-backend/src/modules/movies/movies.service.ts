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
// 🌟 ĐỊNH NGHĨA INTERFACES ĐỂ KHÓA TIẾNG ESLINT (TYPE-SAFE FOR OPHIM API)
// ====================================================================
interface OphimCategorySource {
  name: string;
  slug?: string;
}

interface OphimEpisodeItemSource {
  name: string;
  slug: string;
  link_m3u8: string;
}

interface OphimMovieDetailSource {
  name: string;
  slug: string;
  origin_name?: string;
  content?: string;
  thumb_url?: string;
  poster_url?: string;
  type: string;
  time?: string;
  category: OphimCategorySource[];
}

interface OphimDetailResponse {
  status: boolean;
  movie: OphimMovieDetailSource;
  episodes?: Array<{
    server_name: string;
    server_data: OphimEpisodeItemSource[];
  }>;
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
    const detailApiUrl = `https://ophim1.com/phim/${slug}`;

    try {
      // 🌟 ÉP KIỂU ĐẦU RA REQUEST ĐỂ TRIỆT TIÊU LỖI ANY NGUY HIỂM
      const response = await firstValueFrom(
        this.httpService.get<OphimDetailResponse>(detailApiUrl),
      );
      const rawData = response.data;

      if (!rawData || !rawData.status || !rawData.movie) {
        throw new NotFoundException(
          `Không tìm thấy dữ liệu chi tiết cho phim có slug: ${slug}`,
        );
      }

      const sourceMovie = rawData.movie;
      const sourceEpisodes = rawData.episodes?.[0]?.server_data || [];

      const baseImagePath = 'https://img.ophim.live/uploads/movies/';

      // 2. XỬ LÝ THỂ LOẠI (CATEGORIES) TỰ ĐỘNG
      const categoryIds: number[] = [];
      if (Array.isArray(sourceMovie.category)) {
        for (const cat of sourceMovie.category) {
          const catSlug =
            cat.slug ||
            cat.name
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-');

          const categoryRecord = await this.prisma.category.upsert({
            where: { slug: catSlug },
            update: {},
            create: {
              name: cat.name,
              slug: catSlug,
              description: `Thể loại phim ${cat.name} đồng bộ tự động`,
            },
          });
          categoryIds.push(categoryRecord.id);
        }
      }

      // 3. XỬ LÝ LƯU HOẶC GHI ĐÈ THÔNG TIN PHIM (MOVIE UPSERT)
      const finalPosterUrl = sourceMovie.thumb_url
        ? sourceMovie.thumb_url.startsWith('http')
          ? sourceMovie.thumb_url
          : `${baseImagePath}${sourceMovie.thumb_url}`
        : null;
      const finalBackdropUrl = sourceMovie.poster_url
        ? sourceMovie.poster_url.startsWith('http')
          ? sourceMovie.poster_url
          : `${baseImagePath}${sourceMovie.poster_url}`
        : null;

      // Khắc phục lỗi TypeScript Enum mapping bằng cách kiểm tra ép kiểu chặt chẽ
      const computedMovieType: MovieType =
        sourceMovie.type === 'single' ? MovieType.SINGLE : MovieType.SERIES;

      const savedMovie = await this.prisma.movie.upsert({
        where: { slug: sourceMovie.slug },
        update: {
          title: sourceMovie.name,
          original_title: sourceMovie.origin_name || null,
          description: sourceMovie.content || 'Chưa có tóm tắt.',
          poster_url: finalPosterUrl,
          backdrop_url: finalBackdropUrl,
          type: computedMovieType,
          duration: sourceMovie.time
            ? parseInt(sourceMovie.time, 10) || null
            : null,
          categories: {
            deleteMany: {},
            create: categoryIds.map((catId) => ({ categoryId: catId })),
          },
        },
        create: {
          title: sourceMovie.name,
          slug: sourceMovie.slug,
          original_title: sourceMovie.origin_name || null,
          description: sourceMovie.content || 'Chưa có tóm tắt.',
          poster_url: finalPosterUrl,
          backdrop_url: finalBackdropUrl,
          type: computedMovieType,
          status: MovieStatus.DRAFT,
          duration: sourceMovie.time
            ? parseInt(sourceMovie.time, 10) || null
            : null,
          categories: {
            create: categoryIds.map((catId) => ({ categoryId: catId })),
          },
        },
      });

      // 4. XỬ LÝ ĐỔ DANH SÁCH TẬP PHIM HÀNG LOẠT
      await this.prisma.episode.deleteMany({
        where: { movie_id: savedMovie.id },
      });

      if (sourceEpisodes.length > 0) {
        const episodesDataToInsert = sourceEpisodes.map((ep, index) => ({
          movie_id: savedMovie.id,
          episode_number: index + 1,
          title: ep.name,
          slug: ep.slug || `tap-${index + 1}`,
          video_url: ep.link_m3u8 || '',
          order: index + 1,
        }));

        await this.prisma.episode.createMany({
          data: episodesDataToInsert,
        });
      }

      return {
        movie_id: savedMovie.id,
        title: savedMovie.title,
        slug: savedMovie.slug,
        total_episodes: sourceEpisodes.length,
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Lỗi không xác định';
      console.error(`❌ Lỗi đồng bộ chi tiết phim slug [${slug}]:`, errorMsg);
      throw error;
    }
  }

  // ================== [MỚI 2] HÀM ĐỒNG BỘ CÔNG NGHIỆP: CÀO HÀNG LOẠT THEO TRANG ==================
  async syncEntirePageFromSource(pageNumber: number) {
    const listApiUrl = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${pageNumber}`;
    console.log(
      `🚀 KÍCH HOẠT BOT CÀO PHIM: Đang quét danh sách trang số ${pageNumber}...`,
    );

    try {
      // 🌟 ÉP KIỂU ĐẦU RA REQUEST ĐỂ TRIỆT TIÊU LỖI ANY TẠI HÀM CÀO TRANG
      const response = await firstValueFrom(
        this.httpService.get<OphimListResponse>(listApiUrl),
      );
      const rawData = response.data;

      if (!rawData || !rawData.items || rawData.items.length === 0) {
        throw new NotFoundException(
          `Không tìm thấy danh sách phim tại trang số ${pageNumber}`,
        );
      }

      const movieItems = rawData.items;
      const syncReports: SyncReportItem[] = []; // Khai báo rõ ràng mảng định kiểu tránh lỗi 'never'

      console.log(
        `📡 Phát hiện ${movieItems.length} bộ phim. Bắt đầu tiến trình bóc tách tự động...`,
      );

      for (const item of movieItems) {
        try {
          const result = await this.crawlAndSyncFromSource(item.slug);
          syncReports.push({
            title: item.name,
            slug: item.slug,
            status: 'Thành công',
            total_episodes: result.total_episodes,
          });
        } catch (singleMovieError) {
          const errMsg =
            singleMovieError instanceof Error
              ? singleMovieError.message
              : 'Lỗi không xác định';
          syncReports.push({
            title: item.name,
            slug: item.slug,
            status: 'Thất bại',
            reason: errMsg, // Khắc phục triệt để lỗi 'unknown' của catch block
          });
        }
      }

      return {
        message: `Tiến trình đồng bộ hàng loạt tại trang số ${pageNumber} hoàn tất!`,
        total_movies_processed: movieItems.length,
        success_count: syncReports.filter((r) => r.status === 'Thành công')
          .length,
        failed_count: syncReports.filter((r) => r.status === 'Thất bại').length,
        reports: syncReports,
      };
    } catch (error) {
      console.error('❌ Lỗi hệ thống khi chạy Bot cào trang:', error);
      throw new BadRequestException(
        `Không thể đồng bộ dữ liệu trang số ${pageNumber}. Server nguồn lỗi.`,
      );
    }
  }

  //================== HÀM HỖ TRỢ DÙNG CHUNG ==================
  // Viết 1 hàm nhỏ để kiểm tra mảng categoryIds có hợp lệ không
  private async validateCategoriesExist(categoryIds: number[]) {
    if (!categoryIds || categoryIds.length === 0) return;

    // Tìm tất cả các category có ID nằm trong mảng categoryIds
    const existingCategories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true }, // Chỉ lấy ID cho nhẹ
    });

    // Nếu số lượng tìm thấy không bằng số lượng gửi lên -> Có ID ảo
    if (existingCategories.length !== categoryIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều ID Thể loại không tồn tại trong hệ thống.',
      );
    }
  }

  // 1. TẠO MỚI PHIM
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

    // Bước 1: Kiểm tra xem slug đã tồn tại chưa
    const existingMovie = await this.prisma.movie.findUnique({
      where: { slug: movieData.slug },
    });
    if (existingMovie) {
      throw new ConflictException(
        'Slug phim đã tồn tại, vui lòng chọn slug khác.',
      );
    }

    // Bước 2: Validate Category IDs trước khi tạo
    const parsedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds.map(Number)
      : [];
    await this.validateCategoriesExist(parsedCategoryIds);

    // Bước 3: Tạo phim
    return this.prisma.movie.create({
      data: {
        ...movieData,
        description: synopsis,
        original_title: originalTitle || null,
        poster_url: posterUrl || null,
        backdrop_url: backdropUrl || null,
        release_date: releaseDate ? new Date(releaseDate) : null,
        categories: {
          create: parsedCategoryIds.map((id) => ({
            categoryId: id,
          })),
        },
      },
      include: {
        categories: { include: { category: true } },
      },
    });
  }

  // 2. LẤY DANH SÁCH PHIM
  async findAll(
    page: number,
    limit: number,
    keyword?: string,
    status?: MovieStatus,
    sortBy: string = 'created_at', // Mặc định sắp xếp theo ngày tạo
    sortOrder: 'asc' | 'desc' = 'desc', // Mặc định là mới nhất đưa lên đầu (desc)
  ) {
    const skip = (page - 1) * limit;
    const whereCondition: Prisma.MovieWhereInput = {};

    if (keyword) {
      whereCondition.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { original_title: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (status) {
      whereCondition.status = status;
    }

    // TẠO CÚ PHÁP SẮP XẾP ĐỘNG CHO PRISMA
    // Ví dụ nếu người dùng truyền: sortBy = 'view_count', sortOrder = 'desc'
    // Biến này sẽ trở thành: { view_count: 'desc' }
    const orderByCondition = {
      [sortBy]: sortOrder,
    } as Prisma.MovieOrderByWithRelationInput;

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        include: { categories: { include: { category: true } } },
        orderBy: orderByCondition, // <--- Nhúng biến sắp xếp động vào đây
      }),
      this.prisma.movie.count({ where: whereCondition }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 3. LẤY THÔNG TIN CHI TIẾT
  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        seasons: { include: { episodes: true } },
        episodes: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Không tìm thấy bộ phim này.');
    }
    return movie;
  }

  // 4. CẬP NHẬT PHIM
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

    // MỚI: Validate Category IDs trước khi update
    const parsedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds.map(Number)
      : undefined;
    if (parsedCategoryIds) {
      await this.validateCategoriesExist(parsedCategoryIds);
    }

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
              create: parsedCategoryIds.map((catId) => ({
                categoryId: catId,
              })),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
      },
    });
  }

  // 5. XÓA MỀM PHIM
  async remove(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('Không tìm thấy bộ phim này.');

    // Thay vì dùng this.prisma.movie.delete(), ta chuyển status thành ARCHIVED
    await this.prisma.movie.update({
      where: { id },
      data: { status: MovieStatus.ARCHIVED },
    });

    return {
      message: `Đã đưa phim "${movie.title}" vào lưu trữ (Soft Delete) thành công.`,
    };
  }
}
