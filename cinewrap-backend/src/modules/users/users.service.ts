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
import { CreateAdminDto } from './dto/create-admin.dto';

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

  // 1. CREATE: Tạo tài khoản (Đăng ký thường qua luồng công khai)
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
        // ÉP CỨNG GIÁ TRỊ TẠI ĐÂY: Người dùng bình thường không thể tự gán role
        role: 'USER',
        subscription_type: 'FREE',
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
  async remove(id: number, currentUser: UserPayload) {
    // 1. Kiểm tra: Chỉ ADMIN mới được phép xóa
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này!',
      );
    }

    // 2. Không cho phép Admin xóa chính mình (nếu cần thiết)
    if (currentUser.id === id) {
      throw new ForbiddenException(
        'Bạn không thể tự xóa tài khoản của chính mình!',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng ID ${id}`);
    }

    return this.prisma.user.delete({
      where: { id },
      select: { id: true, email: true }, // Chỉ cần trả về id và email đã xóa thành công
    });
  }

  // 6. Luồng tạo Admin nội bộ (Không qua đăng ký, chỉ do Admin khác tạo)
  async createSystemAccount(createAdminDto: CreateAdminDto) {
    // 1. Kiểm tra trùng email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createAdminDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại!');
    }

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // 3. Lưu vào DB (Lưu ý: truyền đủ các trường role/subscription_type)
    return this.prisma.user.create({
      data: {
        email: createAdminDto.email,
        password: hashedPassword,
        full_name: createAdminDto.full_name,
        role: createAdminDto.role || 'USER', // Nếu Admin để trống role, mặc định là USER
        subscription_type: createAdminDto.subscription_type || 'FREE',
      },
      select: userSelectOptions, // Trả về thông tin an toàn
    });
  }
}
