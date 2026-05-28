import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
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
}
