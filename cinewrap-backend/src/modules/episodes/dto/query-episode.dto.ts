// DTO để chuẩn hóa các tham số Admin truyền lên khi lọc danh sách và đổi số tập.
import { IsOptional, IsInt, IsString, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
// LƯU Ý: Ở Phase 2, bạn nên import EpisodeStatus từ '@prisma/client'
// thay vì tự định nghĩa, sau khi đã đổi cột status trong schema.prisma thành Enum.
import { EpisodeStatus } from './create-episode.dto';

export class QueryEpisodeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(EpisodeStatus)
  status?: EpisodeStatus;

  @IsOptional()
  @IsString()
  search?: string; // Tìm theo tiêu đề tập phim
}
