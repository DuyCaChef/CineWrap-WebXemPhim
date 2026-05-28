import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MovieStatus } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // ================= ADMIN API =================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  // Khóa lại: Chỉ admin mới xem được danh sách tất cả các loại phim (DRAFT, PENDING...)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Get('admin')
  findAllForAdmin(@Query() query: FilterMovieDto) {
    const { page = 1, limit = 10, keyword, status, sortBy, sortOrder } = query;
    return this.moviesService.findAll(
      page,
      limit,
      keyword,
      status,
      sortBy,
      sortOrder,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  // Khóa lại: Đã thêm khóa bảo vệ DELETE
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }

  // ================= PUBLIC API (Cho User thường) =================

  // Mở public: Bất cứ ai cũng gọi được, nhưng bị ÉP BUỘC chỉ trả về phim PUBLISHED
  @Get()
  findAllPublic(@Query() query: FilterMovieDto) {
    const { page = 1, limit = 10, keyword, sortBy, sortOrder } = query;
    // Cố tình truyền 'PUBLISHED' cứng vào hàm findAll để phớt lờ query status của User
    return this.moviesService.findAll(
      page,
      limit,
      keyword,
      MovieStatus.PUBLISHED,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }
}
