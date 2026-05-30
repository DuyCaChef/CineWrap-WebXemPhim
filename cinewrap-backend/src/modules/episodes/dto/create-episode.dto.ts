import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export enum EpisodeStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

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
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Thời lượng phải là số nguyên' })
  @Min(1, { message: 'Thời lượng không được nhỏ hơn 1 phút' })
  duration?: number;

  @IsOptional()
  @IsEnum(EpisodeStatus, { message: 'Trạng thái không hợp lệ' })
  status?: EpisodeStatus;
}
