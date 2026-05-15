import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Import JwtAuthGuard để bảo vệ route

// Mở rộng interface Request để thêm thông tin user vào req.user sau khi xác thực JWT thành công
interface RequestWithUser extends Request {
  user: {
    userId: number;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. Validate User
    const user = await this.authService.validateUser(body.email, body.password);

    // 2. Tạo Tokens
    const tokens = await this.authService.generateToken(
      user.id,
      user.email,
      user.role,
    );

    // 3. Set Refresh Token vào HttpOnly Cookie (chống Hacker)
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true, // Chỉ cho phép truy cập cookie qua HTTP(S), không cho phép JavaScript truy cập -> chống XSS
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS khi ở môi trường production
      sameSite: 'lax', // Chống CSRF, cookie chỉ được gửi khi truy cập từ cùng một trang hoặc từ các trang khác nhưng không phải là cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie sống 7 ngày
    });

    // 4. Trả về Access Token cho client!
    return {
      message: 'Đăng nhập thành công',
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Route này chỉ có thể truy cập nếu có Access Token hợp lệ
  @UseGuards(JwtAuthGuard) // Bảo vệ route bằng JwtAuthGuard
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    // Nếu code lọt được vào vòng này, nghĩa là token hợp lệ và thông tin user đã được gắn vào req.user bởi JwtStrategy
    return {
      message: 'Thông tin profile của bạn',
      userInfo: req.user, // Thông tin user được lấy từ token, là cục { userId, username, role } ta return ở file Strategy
    };
  }

  // --- LUỒNG 4: API ĐĂNG XUẤT ---
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // Lễ tân dọn dẹp sạch sẽ chiếc vé refresh_token khỏi Cookie
    res.clearCookie('refresh_token');
    return { message: 'Đăng xuất thành công' };
  }

  // --- LUỒNG 6: API ĐỔI VÉ ---
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('🔍 Toàn bộ Cookies nhận được:', req.cookies);

    // 1. Lấy Refresh Token từ cookie
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Không tìm thấy Refresh Token trong Cookie!',
      );
    }

    // 2. Gọi service để làm mới token
    const tokens = await this.authService.refreshToken(refreshToken);

    // 3. Gửi Access Token mới về cho client (trong body) và cập nhật Refresh Token mới trong cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // 4. Trả về Access Token mới cho client
    return {
      message: 'Làm mới token thành công',
      accessToken: tokens.accessToken,
    };
  }
}
