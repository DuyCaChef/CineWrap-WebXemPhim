import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CurrentUser,
  UserPayload,
} from '../../common/decorators/current-user.decorator';

// Tạo một Interface mở rộng để TypeScript biết trong Request có chứa user
interface RequestWithUser extends Request {
  user?: {
    id: number;
    [key: string]: unknown; // Các trường khác tùy ý
  };
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ====================================================================
  // 1. TẠO MỚI DANH MỤC (Chỉ Admin/Mod)
  // ====================================================================
  @UseGuards(JwtAuthGuard, RolesGuard) // Guard xác thực và Guard phân quyền
  @Roles('ADMIN', 'MODERATOR') // Chỉ Admin và Mod được tạo
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: UserPayload, // Sử dụng @CurrentUser để lấy thông tin người dùng đã được xác thực
  ) {
    return this.categoriesService.create(createCategoryDto, user.id);
  }

  // ====================================================================
  // 2. LẤY DANH SÁCH & PHÂN TRANG (API Public cho mọi người dùng)
  // ====================================================================
  @Get()
  findAll(@Query() query: QueryCategoryDto, @CurrentUser() user?: UserPayload) {
    return this.categoriesService.findAll(query, user);
  }

  // ====================================================================
  // 3. XEM CHI TIẾT THEO ID (API Public)
  // ====================================================================
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('locale') locale?: string,
    @CurrentUser() user?: UserPayload,
  ) {
    return this.categoriesService.findOne(id, locale, user);
  }

  // ====================================================================
  // 4. CẬP NHẬT DANH MỤC (Chỉ Admin/Mod)
  // ====================================================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  // ====================================================================
  // 5. XÓA MỀM / LƯU TRỮ (Chỉ Admin tối cao)
  // ====================================================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    const userId = req.user?.id ? Number(req.user.id) : 1;
    return this.categoriesService.remove(id, userId);
  }

  // ====================================================================
  //  KHÔI PHỤC DANH MỤC TỪ ARCHIVED/DELETED
  // ====================================================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/restore')
  restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.categoriesService.restore(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Post(':id/movies/:movieId')
  attachMovie(
    @Param('id', ParseIntPipe) categoryId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.categoriesService.attachToMovie(categoryId, movieId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Delete(':id/movies/:movieId')
  detachMovie(
    @Param('id', ParseIntPipe) categoryId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.categoriesService.detachFromMovie(categoryId, movieId);
  }
}
