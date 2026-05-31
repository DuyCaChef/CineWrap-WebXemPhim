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

// Import các Guard của bạn (Đường dẫn tùy thuộc vào cấu trúc thư mục của bạn)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum'; // Enum chứa 'ADMIN', 'MODERATOR', 'USER'
import { ReorderEpisodeDto } from './dto/reorder-episode.dto';
import { QueryEpisodeDto } from './dto/query-episode.dto';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  // ==================== PHẠM VI ADMIN ====================
  // Chỉ Admin và Mod mới được gọi 3 API dưới đây

  // API tạo tập phim mới
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // 💡 Khóa cửa: Yêu cầu Token hợp lệ
  @Roles(Role.ADMIN, Role.MODERATOR) // 💡 Kiểm tra thẻ nhân viên: Chỉ cho ADMIN/MOD
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodesService.create(createEpisodeDto);
  }

  // API cập nhật thông tin tập phim
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.episodesService.update(id, updateEpisodeDto);
  }

  // API xóa mềm tập phim (soft delete)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.remove(id); // Gọi hàm xóa mềm
  }

  // API lấy danh sách tập phim cho Admin, có phân trang và lọc nâng cao
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  findAllAdmin(@Query() query: QueryEpisodeDto) {
    // Controller cực sạch, ValidationPipe tự ép kiểu page/limit qua QueryEpisodeDto
    return this.episodesService.findAllAdmin(query);
  }

  // API khôi phục tập phim đã xóa mềm
  @Patch('admin/:id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.restore(id);
  }

  // API tạo hàng loạt tập phim (Bulk Create) - Dành cho Admin/Mod khi cần nhập nhiều tập cùng lúc
  @Post('admin/bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  bulkCreate(
    @Body(new ParseArrayPipe({ items: CreateEpisodeDto }))
    dtos: CreateEpisodeDto[],
  ) {
    // ParseArrayPipe giúp validate TỪNG PHẦN TỬ trong mảng JSON gửi lên
    return this.episodesService.bulkCreate(dtos);
  }

  // API sắp xếp lại thứ tự tập phim (Reorder) - Dành cho Admin/Mod
  @Patch('admin/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  reorder(
    @Body(new ParseArrayPipe({ items: ReorderEpisodeDto }))
    updates: ReorderEpisodeDto[],
  ) {
    return this.episodesService.reorder(updates);
  }

  // ==================== PHẠM VI PUBLIC ====================
  // Public API không gắn Guard, ai cũng xem được (nhưng Service đã chặn chỉ trả PUBLISHED)

  @Get('public/movie/:movieId')
  findAllByMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    // Tự động ép kiểu số, nếu không truyền sẽ lấy mặc định là 1 và 20
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) pageNum: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limitNum: number,
  ) {
    return this.episodesService.findAllPublicByMovie(
      movieId,
      pageNum,
      limitNum,
    );
  }

  // Lấy danh sách tập riêng cho 1 Season cụ thể
  @Get('public/season/:seasonId')
  findAllBySeason(@Param('seasonId', ParseIntPipe) seasonId: number) {
    return this.episodesService.findAllPublicBySeason(seasonId);
  }

  // Lấy chi tiết tập phim để chạy Player xem phim (Tìm bằng movieSlug + số tập)
  // URL Ví dụ thực tế: /episodes/public/watch/tay-du-ky/episode/1
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
}
