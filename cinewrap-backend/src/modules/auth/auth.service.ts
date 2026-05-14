import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Đường dẫn trỏ tới Prisma module
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Định nghĩa rõ ràng khuôn dữ liệuDTO cho đăng ký người dùng
export interface RegisterDto {
  email: string;
  password: string;
  full_name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // --- LUỒNG 1: ĐĂNG KÝ ---
  async register(dto: RegisterDto) {
    // 1. Kiểm tra xem email đã tồn tại chưa
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExists) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // 2. Hash mật khẩu trước khi lưu vào DB (mã hoá 10 vòng)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // 3. Lưu người dùng mới vào DB
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        full_name: dto.full_name,
        role: 'USER', // Mặc định role là USER
      },
    });
    return { message: 'Đăng ký thành công', userId: newUser.id };
  }

  // --- LUỒNG 2: KIỂM TRA MẬT KHẨU ---
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Email hoặc Mật khẩu không đúng');

    return user;
  }

  // --- LUỒNG 3: TẠO TOKEN ---
  async generateToken(userId: number, role: string) {
    const payload = { sub: userId, role };

    const [accessToken, refreshToken] = await Promise.all([
      // Access Token có thời gian sống ngắn (15 phút)
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }), // Access Token sống 15 phút
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }), // Refresh Token sống 7 ngày
    ]);

    return { accessToken, refreshToken };
  }
}
