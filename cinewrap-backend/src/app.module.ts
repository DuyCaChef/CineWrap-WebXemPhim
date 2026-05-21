import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    PrismaModule, // Cắm Prisma vào hệ thống chính để dùng chung cho mọi nơi
    AuthModule,
    UsersModule,
    CategoriesModule, // Cắm tính năng Auth vào
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
