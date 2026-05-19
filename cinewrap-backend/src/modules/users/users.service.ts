import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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
    // Kiểm tra xem email đã tồn tại trong database chưa, nếu có thì ném ra lỗi ConflictException (HTTP 409)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    // Nếu existingUser khác null nghĩa là đã có người dùng với email đó, nên ném lỗi
    if (existingUser) {
      throw new ConflictException(
        'Email đã được sử dụng, vui lòng chọn email khác!',
      );
    }

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
    // Trước khi cập nhật, cần kiểm tra xem người dùng với ID đó có tồn tại không. Nếu không tồn tại, ném ra lỗi NotFoundException (HTTP 404)
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID là ${id}`);
    }

    // Nếu updateUserDto có chứa trường password, cần hash lại mật khẩu trước khi cập nhật vào database
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

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
