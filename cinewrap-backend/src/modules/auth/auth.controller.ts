import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
    const tokens = await this.authService.generateToken(user.id, user.role);

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
}
