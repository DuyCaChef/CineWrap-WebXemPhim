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
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MovieStatus } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // POST: Chỉ Admin/Content Editor được tạo
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  // GET: Ai cũng xem được, nhưng có thể truyền query để phân trang/tìm kiếm
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('keyword') keyword: string,
    @Query('status') status?: MovieStatus,
  ) {
    // Ép kiểu từ query string sang number
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    // TODO: Ở đây cần logic chặn User thường truyền status=DRAFT.
    // Nếu không có Token Admin, force status = 'PUBLISHED'.

    return this.moviesService.findAll(pageNumber, limitNumber, keyword, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  // API Cập nhật phim
  // Route: PATCH /movies/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  // API Xóa phim
  // Route: DELETE /movies/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
