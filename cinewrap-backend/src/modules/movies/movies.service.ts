import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Prisma, MovieStatus } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

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
