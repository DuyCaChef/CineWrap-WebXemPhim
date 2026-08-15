import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // Đảm bảo đường dẫn import đúng

@Module({
  imports: [PrismaModule],
  controllers: [EpisodesController],
  providers: [EpisodesService],
  exports: [EpisodesService], // Xuất service để các module khác tái sử dụng khi cần
})
export class EpisodesModule {}
