import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'; // Kéo thư viện JWT vào
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Khai báo JwtModule để AuthService có thể dùng được JwtService
    PrismaModule, // Cắm Prisma vào để AuthService có thể dùng được PrismaService
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Đăng ký JwtStrategy để Passport có thể sử dụng chiến lược này khi xác thực JWT
})
export class AuthModule {}
