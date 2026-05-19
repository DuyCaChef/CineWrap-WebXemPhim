import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Đường dẫn trỏ tới Prisma module
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

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
      throw new ConflictException('Email đã được sử dụng');
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
    if (!user)
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác',
      );

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch)
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác',
      );

    const { password, ...safeUser } = user;
    void password;
    return safeUser;
  }

  // --- LUỒNG 3: TẠO TOKEN ---
  async generateToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, username: email, role: role };

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

  // --- LUỒNG 5: LÀM MỚI TOKEN (REFRESH TOKEN) ---
  async refreshToken(refreshToken: string) {
    try {
      // 1. Xác minh Refresh Token
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        username: string;
        role: string;
      }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // 2. Nếu token hợp lệ, tạo mới Access Token
      // Truyền đúng thứ tự tham số: userId, email, role
      return this.generateToken(payload.sub, payload.username, payload.role);
    } catch {
      // Nếu hacker cố tình truyền token láo, hoặc thẻ đã quá 7 ngày -> Đuổi ra!
      throw new UnauthorizedException(
        'Refresh Token không hợp lệ hoặc đã hết hạn!',
      );
    }
  }
}
