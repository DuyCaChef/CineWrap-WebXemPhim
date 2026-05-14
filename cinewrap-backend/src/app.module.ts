import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // Cắm Prisma vào hệ thống chính để dùng chung cho mọi nơi
    AuthModule, // Cắm tính năng Auth vào
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
