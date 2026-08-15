import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
  DefaultValuePipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { QueryEpisodeDto } from './dto/query-episode.dto';
import { ReorderEpisodeDto } from './dto/reorder-episode.dto';

// Import Guards & Decorators Phân quyền
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum'; // Hoặc '../users/enums/role.enum' tùy cấu trúc dự án

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  // =========================================================================
  // 🔐 PHẠM VI ADMIN / MODERATOR (Yêu cầu JWT Token & Phân quyền Role)
  // =========================================================================

  /**
   * 1. Tạo tập phim đơn lẻ (Hỗ trợ cả Movie lẻ hoặc Season của Phim bộ)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodesService.create(createEpisodeDto);
  }

  /**
   * 2. Lấy danh sách tập phim cho Admin (Hỗ trợ Pagination, Search, Filter Status)
   */
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  findAllAdmin(@Query() query: QueryEpisodeDto) {
    return this.episodesService.findAllAdmin(query);
  }

  /**
   * 3. Nhập tập phim hàng loạt (Bulk Create)
   */
  @Post('admin/bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  bulkCreate(
    @Body(new ParseArrayPipe({ items: CreateEpisodeDto }))
    dtos: CreateEpisodeDto[],
  ) {
    return this.episodesService.bulkCreate(dtos);
  }

  /**
   * 4. Sắp xếp / Đổi số tập hàng loạt (Reorder - Chống lỗi P2002 Unique Constraint)
   */
  @Patch('admin/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  reorder(
    @Body(new ParseArrayPipe({ items: ReorderEpisodeDto }))
    updates: ReorderEpisodeDto[],
  ) {
    return this.episodesService.reorder(updates);
  }

  /**
   * 5. Khôi phục tập phim đã xóa mềm từ ARCHIVED về DRAFT
   */
  @Patch('admin/:id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.restore(id);
  }

  /**
   * 6. Cập nhật thông tin tập phim
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.episodesService.update(id, updateEpisodeDto);
  }

  /**
   * 7. Xóa mềm tập phim (Chuyển trạng thái sang ARCHIVED)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.remove(id);
  }

  // =========================================================================
  // 🌍 PHẠM VI PUBLIC (Không yêu cầu đăng nhập - Chỉ trả về tập PUBLISHED)
  // =========================================================================

  /**
   * 8. Lấy toàn bộ danh sách tập theo Movie ID (Có phân trang)
   */
  @Get('public/movie/:movieId')
  findAllByMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) pageNum: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limitNum: number,
  ) {
    return this.episodesService.findAllPublicByMovie(
      movieId,
      pageNum,
      limitNum,
    );
  }

  /**
   * 9. Lấy danh sách tập theo Season ID (Dành cho giao diện chọn Season của Phim bộ)
   */
  @Get('public/season/:seasonId')
  findAllBySeason(@Param('seasonId', ParseIntPipe) seasonId: number) {
    return this.episodesService.findAllPublicBySeason(seasonId);
  }

  /**
   * 10. Lấy chi tiết tập phim kèm danh sách Server Video và Navigation Next/Prev
   * Ví dụ URL: GET /episodes/public/watch/tay-du-ky/episode/1
   */
  @Get('public/watch/:movieSlug/episode/:episodeNumber')
  findOneDetail(
    @Param('movieSlug') movieSlug: string,
    @Param('episodeNumber', ParseIntPipe) episodeNumber: number,
  ) {
    return this.episodesService.findOnePublicBySlugAndNumber(
      movieSlug,
      episodeNumber,
    );
  }

  /**
   * 11. Ghi nhận lượt xem (+1 view) cho Tập phim và Phim gốc
   */
  @Post('public/:id/view')
  increaseViewCount(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.increaseViewCount(id);
  }
}
