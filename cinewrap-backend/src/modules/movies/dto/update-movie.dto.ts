import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsUrl,
  IsDateString,
  IsArray,
} from 'class-validator';
import { MovieType, MovieStatus } from '@prisma/client';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  originalTitle?: string;

  @IsString()
  @IsOptional()
  slug?: string;

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
  releaseDate?: string;

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
  categoryIds?: number[];
}
