import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsUrl,
  IsDateString,
  IsArray,
} from 'class-validator';
import { MovieType, MovieStatus } from '@prisma/client';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên phim không được để trống' })
  title!: string;

  @IsString()
  @IsOptional()
  originalTitle?: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug!: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsEnum(MovieType)
  @IsOptional()
  type?: MovieType;

  @IsEnum(MovieStatus)
  @IsOptional()
  status?: MovieStatus;

  @IsDateString()
  @IsOptional()
  releaseDate?: string; // Dùng string ISO 8601 từ frontend gửi lên

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @IsUrl()
  @IsOptional()
  backdropUrl?: string;

  @IsArray()
  @IsOptional()
  categoryIds?: number[]; // Mảng chứa ID của các thể loại (Genre)
}
