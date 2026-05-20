import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { RolesGuard } from '../../common/guards/roles/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, RolesGuard],
})
export class UsersModule {}
