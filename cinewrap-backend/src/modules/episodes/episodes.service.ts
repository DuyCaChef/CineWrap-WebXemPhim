import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEpisodeDto, EpisodeStatus } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // 1. CORE ADMIN: TẠO TẬP PHIM (Có kiểm tra Phim lẻ / Phim bộ)
  // ==========================================
  async create(createEpisodeDto: CreateEpisodeDto) {
    const { movie_id, season_id, episode_number } = createEpisodeDto;

    // Kiểm tra tính hợp lệ: Không được để trống cả 2, hoặc điền cả 2
    if (!movie_id && !season_id) {
      throw new BadRequestException(
        'Tập phim phải thuộc về một Movie hoặc một Season cụ thể!',
      );
    }
    if (movie_id && season_id) {
      throw new BadRequestException(
        'Không thể điền cả Movie ID và Season ID cùng lúc. Hãy chọn 1 trong 2.',
      );
    }

    // Trường hợp 1: Tập phim thuộc về một SEASON (Phim bộ)
    if (season_id) {
      const seasonExists = await this.prisma.season.findUnique({
        where: { id: season_id },
      });
      if (!seasonExists)
        throw new NotFoundException(
          `Không tìm thấy Season với ID ${season_id}`,
        );

      // Kiểm tra xem số tập này đã tồn tại trong Season này chưa
      const dupEpisode = await this.prisma.episode.findFirst({
        where: { season_id, episode_number },
      });
      if (dupEpisode)
        throw new ConflictException(
          `Season này đã có tập số ${episode_number} rồi!`,
        );
    }

    // Trường hợp 2: Tập phim thuộc thẳng về MOVIE (Phim lẻ / Phim không chia season)
    if (movie_id) {
      const movieExists = await this.prisma.movie.findUnique({
        where: { id: movie_id },
      });
      if (!movieExists)
        throw new NotFoundException(
          `Không tìm thấy bộ phim với ID ${movie_id}`,
        );

      const dupEpisode = await this.prisma.episode.findFirst({
        where: { movie_id, episode_number },
      });
      if (dupEpisode)
        throw new ConflictException(
          `Bộ phim này đã có tập số ${episode_number} rồi!`,
        );
    }

    // Nếu vượt qua tất cả các chốt chặn dữ liệu -> Tiến hành lưu vào DB
    return this.prisma.episode.create({
      data: createEpisodeDto,
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

    // Logic nâng cao: Người dùng truyền vào Movie ID.
    // Chúng ta phải tìm xem tập phim nằm trực tiếp ở Movie đó HOẶC nằm trong các Season thuộc Movie đó.
    const [episodes, total] = await Promise.all([
      this.prisma.episode.findMany({
        where: {
          status: EpisodeStatus.PUBLISHED, // Rule bảo mật công khai
          OR: [
            { movie_id: movieId }, // Hoặc thuộc phim lẻ này
            { season: { movie_id: movieId } }, // Hoặc thuộc một Season bất kỳ của bộ phim này (Prisma Relation Filter)
          ],
        },
        orderBy: { episode_number: 'asc' }, // Sắp xếp theo thứ tự tập phim tăng dần
        skip,
        take: limit,
        select: {
          // Trả "Payload nhẹ" tối ưu dung lượng mạng mạng cho danh sách tập
          id: true,
          episode_number: true,
          title: true,
          slug: true,
          duration: true,
        },
      }),
      this.prisma.episode.count({
        where: {
          status: EpisodeStatus.PUBLISHED,
          OR: [{ movie_id: movieId }, { season: { movie_id: movieId } }],
        },
      }),
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
        status: EpisodeStatus.PUBLISHED,
      },
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
        status: EpisodeStatus.PUBLISHED,
        episode_number: episodeNumber,
        OR: [
          { movie: { slug: movieSlug } }, // Nếu là phim lẻ gắn trực tiếp slug
          { season: { movie: { slug: movieSlug } } }, // Nếu là phim bộ xuyên qua bảng Season tới Movie lấy slug
        ],
      },
      include: {
        servers: true, // Gắn kèm danh sách nguồn phát (VideoServer) phục vụ Player xem phim
      },
    });

    // Lỗi chuẩn hóa 404: Che giấu các tập chưa PUBLISHED hoặc điền sai URL
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
}
