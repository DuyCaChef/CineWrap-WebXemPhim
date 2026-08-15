import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReorderEpisodeDto {
  @IsNotEmpty({ message: 'ID tập phim không được để trống' })
  @IsInt({ message: 'ID tập phim phải là số nguyên' })
  id!: number;

  @IsNotEmpty({ message: 'Số tập mới không được để trống' })
  @IsInt({ message: 'Số tập mới phải là số nguyên' })
  @Min(1, { message: 'Số tập mới không được nhỏ hơn 1' })
  episode_number!: number;
}
