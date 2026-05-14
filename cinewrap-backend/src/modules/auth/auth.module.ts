import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'; // Kéo thư viện JWT vào
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    // Khai báo JwtModule để AuthService có thể dùng được JwtService
    PrismaModule, // Cắm Prisma vào để AuthService có thể dùng được PrismaService
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
