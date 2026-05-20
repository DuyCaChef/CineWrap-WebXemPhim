import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  UserPayload,
} from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng cả 2 lớp guard cho toàn bộ Controller này
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN') // Chỉ Admin được tạo user theo luồng này
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN') // Chỉ Admin được lấy danh sách tổng
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'MODERATOR', 'USER') // Cho phép USER vào cửa, nhưng Service sẽ check chính chủ hay không
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload, // Bốc thông tin người đang đăng nhập ra
  ) {
    return this.usersService.findOne(id, user); // Truyền thông tin người gọi API vào Service
  }

  @Patch(':id')
  @Roles('ADMIN', 'USER') // Admin hoặc chính user đó mới được sửa
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserPayload, // Bốc thông tin người đang đăng nhập ra
  ) {
    return this.usersService.update(id, updateUserDto, user); // Truyền vào Service để check owner
  }

  @Delete(':id')
  @Roles('ADMIN') // Chỉ ADMIN mới có quyền xóa tài khoản vĩnh viễn
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
