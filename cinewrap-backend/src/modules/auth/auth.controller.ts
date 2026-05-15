import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
  Req,
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
}
