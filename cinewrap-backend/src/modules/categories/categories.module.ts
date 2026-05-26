import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { RolesGuard } from '../auth/guards/roles.guard'; // Import RolesGuard để đăng ký trong module

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, RolesGuard], // Đăng ký RolesGuard để có thể sử dụng trong Controller, tránh lỗi Dependency Injection khi dùng @UseGuards(RolesGuard)
})
export class CategoriesModule {}
