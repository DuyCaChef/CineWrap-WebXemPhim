import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// TẠO BIẾN DÙNG CHUNG: Nơi quy định những trường được phép trả về cho Frontend
const userSelectOptions = {
  id: true,
  email: true,
  full_name: true,
  avatar: true,
  role: true,
  subscription_type: true,
  created_at: true,
  // TUYỆT ĐỐI KHÔNG CÓ password: true Ở ĐÂY
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Mật khẩu sẽ được hash trước khi lưu vào database, cấu hình số vòng salt là 10 (mặc định của bcrypt)
    const saltRounds = 10;

    // Hash mật khẩu sử dụng bcrypt, hàm hash sẽ trả về một Promise nên cần await để chờ kết quả
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        full_name: createUserDto.full_name,

        // Nếu createUserDto có chứa role/subscription_type, Prisma sẽ lưu giá trị đó.
        // Nếu trống (undefined), Prisma sẽ tự ăn theo @default("USER") và @default("FREE") trong schema.prisma
        role: createUserDto.role,
        subscription_type: createUserDto.subscription_type,
      },
      select: userSelectOptions, // Chỉ trả về những trường được định nghĩa trong userSelectOptions
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: userSelectOptions,
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id: id },
      select: userSelectOptions,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
      select: userSelectOptions,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
      select: userSelectOptions,
    });
  }
}
