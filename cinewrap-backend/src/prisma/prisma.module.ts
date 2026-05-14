import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // QUAN TRỌNG NHẤT LÀ DÒNG NÀY: Cho phép mang Prisma ra ngoài xài
})
export class PrismaModule {}
