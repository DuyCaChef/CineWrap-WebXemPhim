import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Prisma, MovieStatus } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  // 1. TẠO MỚI PHIM
  async create(createMovieDto: CreateMovieDto) {
    // Bóc synopsis ra để xử lý riêng
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

    if (existingMovie) {
      throw new ConflictException(
        'Slug phim đã tồn tại, vui lòng chọn slug khác.',
      );
    }

    return this.prisma.movie.create({
      data: {
        ...movieData,
        description: synopsis, // Sửa lỗi gán nhầm trường synopsis thành description
        original_title: originalTitle || null,
        poster_url: posterUrl || null,
        backdrop_url: backdropUrl || null,
        release_date: releaseDate ? new Date(releaseDate) : null,

        categories: {
          create: Array.isArray(categoryIds)
            ? categoryIds.map((id) => ({
                categoryId: Number(id),
              }))
            : [],
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
  ) {
    const skip = (page - 1) * limit;
    const whereCondition: Prisma.MovieWhereInput = {};

    if (keyword) {
      whereCondition.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { original_title: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // Nếu có status thì lọc theo status, nếu không có thì mặc định lấy tất cả
    if (status) {
      whereCondition.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        include: { categories: { include: { category: true } } },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.movie.count({ where: whereCondition }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
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
      if (existingSlug) {
        throw new ConflictException('Slug phim mới đã tồn tại trên hệ thống.');
      }
    }

    return this.prisma.movie.update({
      where: { id },
      data: {
        title: movieData.title !== undefined ? movieData.title : movie.title,
        slug: movieData.slug !== undefined ? movieData.slug : movie.slug,
        description: synopsis !== undefined ? synopsis : movie.description, // Sửa lỗi gán nhầm trường synopsis thành description
        type: movieData.type !== undefined ? movieData.type : movie.type,
        status:
          movieData.status !== undefined ? movieData.status : movie.status,
        duration:
          movieData.duration !== undefined
            ? movieData.duration
            : movie.duration,

        original_title:
          originalTitle !== undefined ? originalTitle : movie.original_title,
        poster_url: posterUrl !== undefined ? posterUrl : movie.poster_url,
        backdrop_url:
          backdropUrl !== undefined ? backdropUrl : movie.backdrop_url,
        release_date: releaseDate ? new Date(String(releaseDate)) : undefined,

        categories: Array.isArray(categoryIds)
          ? {
              deleteMany: {},
              create: categoryIds.map((catId) => ({
                categoryId: Number(catId),
              })),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
      },
    });
  }

  // 5. XÓA PHIM
  async remove(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie)
      throw new NotFoundException('Không tìm thấy bộ phim này để xóa.');

    await this.prisma.movie.delete({
      where: { id },
    });

    return {
      message: `Xóa thành công bộ phim "${movie.title}" và toàn bộ các dữ liệu liên quan.`,
    };
  }
}
