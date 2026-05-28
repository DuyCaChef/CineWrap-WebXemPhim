import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MovieStatus } from '@prisma/client';

export class FilterMovieDto {
  // @Type(() => Number) giúp tự động biến chuỗi '1' từ URL thành số 1
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  // =============  SẮP XẾP NÂNG CAO =============

  @IsOptional()
  @IsString()
  // Whitelist: Chỉ cho phép sắp xếp theo các cột có thật trong Database này
  @IsIn([
    'created_at',
    'release_date',
    'view_count',
    'average_rating',
    'duration',
    'release_year',
  ])
  sortBy?: string;

  @IsOptional()
  @IsString()
  // Chỉ cho phép truyền 'asc' (Tăng dần) hoặc 'desc' (Giảm dần)
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
