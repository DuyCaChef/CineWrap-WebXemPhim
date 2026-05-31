// Tính năng Reorder (Sắp xếp lại tập phim) cho phép Frontend hiển thị một danh sách để Admin kéo thả (drag & drop) thứ tự các tập phim.
//  Sau khi kéo thả xong, Frontend sẽ gửi lên một Mảng (Array) chứa danh sách các tập phim cần đổi số.
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReorderEpisodeDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsInt()
  @Min(1)
  episode_number!: number;
}
