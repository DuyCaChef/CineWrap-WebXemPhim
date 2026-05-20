import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import * as bcrypt from 'bcrypt';

// Nơi quy định những trường an toàn được phép trả về cho Frontend (Tuyệt đối giấu password)
const userSelectOptions = {
  id: true,
  email: true,
  full_name: true,
  avatar: true,
  role: true,
  subscription_type: true,
  created_at: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE: Tạo tài khoản (Thường do Admin tạo nội bộ)
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email đã được sử dụng, vui lòng chọn email khác!',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        full_name: createUserDto.full_name,
        role: createUserDto.role,
        subscription_type: createUserDto.subscription_type,
      },
      select: userSelectOptions,
    });
  }

  // 2. READ ALL: Lấy danh sách toàn bộ Users (Chỉ ADMIN)
  async findAll() {
    return this.prisma.user.findMany({
      select: userSelectOptions,
    });
  }

  // 3. READ ONE: Lấy chi tiết 1 user (ADMIN, MODERATOR hoặc CHÍNH CHỦ)
  async findOne(id: number, currentUser: UserPayload) {
    // Kiểm tra quyền: Nếu KHÔNG PHẢI Admin/Moderator VÀ id muốn xem khác với id bản thân -> Chặn!
    if (
      currentUser.role !== 'ADMIN' &&
      currentUser.role !== 'MODERATOR' &&
      currentUser.id !== id
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền xem thông tin của người khác!',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectOptions,
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với tài khoản ID ${id}`,
      );
    }
    return user;
  }

  // 4. UPDATE: Cập nhật thông tin (ADMIN hoặc CHÍNH CHỦ tự sửa)
  // Đã bồi thêm currentUser (tham số thứ 3) để đồng bộ với Controller
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: UserPayload,
  ) {
    // Kiểm tra quyền: Chỉ ADMIN hoặc CHÍNH CHỦ (id === currentUser.id) mới được sửa thông tin
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa thông tin của người khác!',
      );
    }

    // Tận dụng hàm findOne ở trên để tự động kiểm tra ID có tồn tại không (Nếu không có sẽ tự ném lỗi 404)
    await this.findOne(id, currentUser);

    // Kiểm tra chặn trùng lặp email khi cập nhật (Đã giữ lại 1 khối lệnh tối ưu duy nhất)
    if (updateUserDto.email) {
      const emailConflict = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      // Nếu email này đã có người sử dụng và người đó KHÔNG PHẢI là chính mình (id)
      if (emailConflict && emailConflict.id !== id) {
        throw new ConflictException(
          'Email mới này đã được sử dụng bởi một tài khoản khác. Vui lòng chọn email khác!',
        );
      }
    }

    // Nếu updateUserDto có chứa password mới, tiến hành hash lại mật khẩu
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: userSelectOptions,
    });
  }

  // 5. DELETE: Xóa người dùng (Chỉ ADMIN được gọi dựa trên Controller)
  async remove(id: number) {
    // Tìm kiếm xem người dùng có thực sự tồn tại trước khi xóa để tránh crash Prisma lỗi 500
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với tài khoản ID ${id} để thực hiện lệnh xóa!`,
      );
    }

    return this.prisma.user.delete({
      where: { id },
      select: { id: true, email: true }, // Chỉ cần trả về id và email đã xóa thành công
    });
  }
}
