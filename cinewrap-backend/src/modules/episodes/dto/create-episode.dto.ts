import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { EpisodeStatus } from '@prisma/client';

export class CreateEpisodeDto {
  @IsOptional()
  @IsInt({ message: 'Movie ID phải là số nguyên' })
  movie_id?: number;

  @IsOptional()
  @IsInt({ message: 'Season ID phải là số nguyên' })
  season_id?: number;

  @IsNotEmpty({ message: 'Số tập không được để trống' })
  @IsInt({ message: 'Số tập phải là số nguyên' })
  @Min(1, { message: 'Số tập không được nhỏ hơn hoặc bằng 0' })
  episode_number!: number;

  @IsOptional()
  @IsString({ message: 'Tiêu đề tập phim phải là chuỗi' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Slug tập phim phải là chuỗi' })
  slug?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả tập phim phải là chuỗi' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Thời lượng phải là số nguyên' })
  @Min(1, { message: 'Thời lượng không được nhỏ hơn 1 phút' })
  duration?: number;

  @IsOptional()
  @IsEnum(EpisodeStatus, {
    message: 'Trạng thái tập phim không hợp lệ (DRAFT, PUBLISHED, ARCHIVED)',
  })
  status?: EpisodeStatus;
}
