import { IsOptional, IsInt, IsString, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EpisodeStatus } from '@prisma/client';

export class QueryEpisodeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng mỗi trang phải lớn hơn hoặc bằng 1' })
  limit?: number = 20;

  @IsOptional()
  @IsEnum(EpisodeStatus, { message: 'Trạng thái lọc không hợp lệ' })
  status?: EpisodeStatus;

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string; // Tìm kiếm theo tiêu đề tập phim
}
