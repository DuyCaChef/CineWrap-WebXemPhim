import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, EpisodeStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { QueryEpisodeDto } from './dto/query-episode.dto';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // 1. CORE ADMIN: TẠO TẬP PHIM (Có kiểm tra Phim lẻ / Phim bộ)
  // ==========================================
  async create(dto: CreateEpisodeDto) {
    // Kiểm tra tính hợp lệ: Không được để trống cả 2, hoặc điền cả 2
    if (!dto.movie_id && !dto.season_id) {
      throw new BadRequestException(
        'Tập phim phải thuộc về một Movie hoặc một Season cụ thể!',
      );
    }
    if (dto.movie_id && dto.season_id) {
      throw new BadRequestException(
        'Không thể điền cả Movie ID và Season ID cùng lúc. Hãy chọn 1 trong 2.',
      );
    }

    // Trường hợp 1: Tập phim thuộc về một SEASON (Phim bộ)
    if (dto.season_id) {
      const seasonExists = await this.prisma.season.findUnique({
        where: { id: dto.season_id },
      });
      if (!seasonExists)
        throw new NotFoundException(
          `Không tìm thấy Season với ID ${dto.season_id}`,
        );

      // Kiểm tra xem số tập này đã tồn tại trong Season này chưa
      const dupEpisode = await this.prisma.episode.findFirst({
        where: { season_id: dto.season_id, episode_number: dto.episode_number },
      });
      if (dupEpisode)
        throw new ConflictException(
          `Season này đã có tập số ${dto.episode_number} rồi!`,
        );
    }

    // Trường hợp 2: Tập phim thuộc thẳng về MOVIE (Phim lẻ / Phim không chia season)
    if (dto.movie_id) {
      const movieExists = await this.prisma.movie.findUnique({
        where: { id: dto.movie_id },
      });
      if (!movieExists)
        throw new NotFoundException(
          `Không tìm thấy bộ phim với ID ${dto.movie_id}`,
        );

      const dupEpisode = await this.prisma.episode.findFirst({
        where: { movie_id: dto.movie_id, episode_number: dto.episode_number },
      });
      if (dupEpisode)
        throw new ConflictException(
          `Bộ phim này đã có tập số ${dto.episode_number} rồi!`,
        );
    }

    // Nếu vượt qua tất cả các chốt chặn dữ liệu -> Tiến hành lưu vào DB
    return this.prisma.episode.create({
      data: dto,
    });
  }

  // ==========================================
  // 2. PUBLIC API: LẤY DANH SÁCH TẬP THEO PHIM (Hỗ trợ phân trang + Sắp xếp)
  // ==========================================
  async findAllPublicByMovie(
    movieId: number,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const whereCondition = {
      status: EpisodeStatus.PUBLISHED, // Tập phim phải PUBLISHED
      OR: [
        // BỔ SUNG CHẶN TỪ GỐC MOVIE: Phim lẻ gốc cũng phải PUBLISHED
        { movie_id: movieId, movie: { status: 'PUBLISHED' } },

        // BỔ SUNG CHẶN TỪ GỐC MOVIE: Hoặc Movie của Phim bộ cũng phải PUBLISHED
        { season: { movie_id: movieId, movie: { status: 'PUBLISHED' } } },
      ],
    } as unknown as Prisma.EpisodeWhereInput; // Ép kiểu để tránh lỗi OR với điều kiện liên quan đến Movie

    const [episodes, total] = await Promise.all([
      this.prisma.episode.findMany({
        where: whereCondition,
        orderBy: { episode_number: 'asc' },
        skip,
        take: limit,
        select: {
          id: true,
          episode_number: true,
          title: true,
          slug: true,
          duration: true,
        },
      }),
      this.prisma.episode.count({ where: whereCondition }),
    ]);

    return {
      data: episodes,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ==========================================
  // 3. PUBLIC API: LẤY DANH SÁCH TẬP THEO SEASON (Dành riêng cho giao diện Phim bộ)
  // ==========================================
  async findAllPublicBySeason(seasonId: number) {
    const episodes = await this.prisma.episode.findMany({
      where: {
        season_id: seasonId,
        status: EpisodeStatus.PUBLISHED, // Tập phim PUBLISHED
        // BỔ SUNG CHẶN TỪ GỐC MOVIE: Xuyên qua Season, kiểm tra Movie gốc phải PUBLISHED
        season: { movie: { status: 'PUBLISHED' } },
      } as unknown as Prisma.EpisodeWhereInput, // Ép kiểu để tránh lỗi OR với điều kiện liên quan đến Movie
      orderBy: { episode_number: 'asc' },
      select: {
        id: true,
        episode_number: true,
        title: true,
        slug: true,
        duration: true,
      },
    });

    return { data: episodes };
  }

  // ==========================================
  // 4. PUBLIC API: CHI TIẾT 1 TẬP THEO MOVIE SLUG + EPISODE NUMBER
  // ==========================================
  async findOnePublicBySlugAndNumber(movieSlug: string, episodeNumber: number) {
    // Tìm tập phim dựa trên Slug của phim gốc kết hợp với số tập
    const episode = await this.prisma.episode.findFirst({
      where: {
        status: EpisodeStatus.PUBLISHED, // Tập phim PUBLISHED
        episode_number: episodeNumber,
        OR: [
          // BỔ SUNG CHẶN TỪ GỐC MOVIE:
          { movie: { slug: movieSlug, status: 'PUBLISHED' } },
          {
            season: { movie: { slug: movieSlug, status: 'PUBLISHED' } },
          },
        ],
      } as unknown as Prisma.EpisodeWhereInput, // Ép kiểu để tránh lỗi OR với điều kiện liên quan đến Movie
      include: {
        servers: true,
      },
    });

    if (!episode) {
      throw new NotFoundException(
        'Tập phim không tồn tại hoặc chưa được xuất bản.',
      );
    }

    return episode;
  }

  // ==========================================
  // 5. ADMIN API: CẬP NHẬT TẬP PHIM
  // ==========================================
  async update(id: number, updateEpisodeDto: UpdateEpisodeDto) {
    // 1. Kiểm tra tập phim có tồn tại không
    const episode = await this.prisma.episode.findUnique({ where: { id } });
    if (!episode) {
      throw new NotFoundException(`Không tìm thấy tập phim với ID ${id}`);
    }

    // Vá lỗi 409: Nếu Admin đổi số tập, phải check xem số mới có bị trùng với tập khác cùng phim không
    if (updateEpisodeDto.episode_number) {
      const isDuplicate = await this.prisma.episode.findFirst({
        where: {
          id: { not: id }, // Ngoại trừ chính nó
          episode_number: updateEpisodeDto.episode_number,
          movie_id: episode.movie_id,
          season_id: episode.season_id,
        },
      });
      if (isDuplicate)
        throw new ConflictException(
          `Số tập ${updateEpisodeDto.episode_number} đã tồn tại!`,
        );
    }

    // 2. Thực hiện update (Đã bỏ check video_url vì link phim được quản lý riêng ở bảng VideoServer)
    return this.prisma.episode.update({
      where: { id },
      data: updateEpisodeDto,
    });
  }

  // ==========================================
  // 6. ADMIN API: XÓA MỀM (SOFT DELETE)
  // ==========================================
  async remove(id: number) {
    const episode = await this.prisma.episode.findUnique({ where: { id } });
    if (!episode) {
      throw new NotFoundException(`Không tìm thấy tập phim với ID ${id}`);
    }

    // Thực hiện Update trạng thái thay vì xóa vật lý
    return this.prisma.episode.update({
      where: { id },
      data: {
        status: EpisodeStatus.ARCHIVED, // Hoặc 'DELETED' tùy bạn quy định
      },
    });
  }

  // ==========================================
  // 7. ADMIN API: LẤY DANH SÁCH & LỌC (FILTER/PAGINATION)
  // ==========================================
  async findAllAdmin(query: QueryEpisodeDto) {
    const { page = 1, limit = 20, status, search } = query;
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.EpisodeWhereInput = {};
    if (status) whereCondition.status = status;
    if (search) {
      whereCondition.title = { contains: search, mode: 'insensitive' };
    }

    const [episodes, total] = await Promise.all([
      this.prisma.episode.findMany({
        where: whereCondition,
        orderBy: { created_at: 'desc' }, // Admin thường thích xem tập mới tạo trước
        skip,
        take: limit,
        include: {
          movie: { select: { title: true } },
          season: true, // Kèm thông tin Season để Admin dễ quản lý
        }, // Kèm tên phim/season để Admin dễ quản lý
      }),
      this.prisma.episode.count({ where: whereCondition }),
    ]);

    return {
      data: episodes,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ==========================================
  // 8. ADMIN API: KHÔI PHỤC TẬP PHIM (RESTORE)
  // ==========================================
  async restore(id: number) {
    const episode = await this.prisma.episode.findUnique({ where: { id } });
    if (!episode) throw new NotFoundException('Không tìm thấy tập phim');
    if (episode.status !== EpisodeStatus.ARCHIVED) {
      throw new BadRequestException(
        'Tập phim này không ở trạng thái ARCHIVED để khôi phục.',
      );
    }

    return this.prisma.episode.update({
      where: { id },
      data: { status: EpisodeStatus.DRAFT }, // Trả về DRAFT để Admin duyệt lại trước khi Publish
    });
  }

  // ==========================================
  // 9. ADMIN API: IMPORT HÀNG LOẠT (BULK CREATE)
  // ==========================================
  async bulkCreate(dtos: CreateEpisodeDto[]) {
    // Dùng createMany của Prisma. skipDuplicates: true giúp bỏ qua các tập bị trùng (unique) thay vì báo lỗi sập toàn bộ
    const result = await this.prisma.episode.createMany({
      data: dtos,
      skipDuplicates: true,
    });
    return { message: `Đã import thành công ${result.count} tập phim.` };
  }

  // ==========================================
  // [PHASE 2 - ADMIN]: ĐỔI SỐ TẬP HÀNG LOẠT (REORDER)
  // ==========================================
  async reorder(updates: { id: number; episode_number: number }[]) {
    // THUẬT TOÁN HOÁN VỊ (Tránh lỗi P2002 Unique Constraint)

    // Bước 1: Bắt tất cả các tập phim cần đổi "đứng lên", gán tạm số tập thành SỐ ÂM (dùng -id để đảm bảo không trùng nhau)
    const tempPromises = updates.map((item) =>
      this.prisma.episode.update({
        where: { id: item.id },
        data: { episode_number: -item.id }, // Gắn giá trị tạm như -75, -77
      }),
    );
    await this.prisma.$transaction(tempPromises);

    // Bước 2: Khi các "ghế" đã trống, tiến hành gán số tập chính thức mới
    const finalPromises = updates.map((item) =>
      this.prisma.episode.update({
        where: { id: item.id },
        data: { episode_number: item.episode_number },
      }),
    );
    await this.prisma.$transaction(finalPromises);

    return { message: 'Cập nhật số tập thành công.' };
  }
}
