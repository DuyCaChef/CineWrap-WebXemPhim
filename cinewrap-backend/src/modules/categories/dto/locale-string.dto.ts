import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LocaleStringDto {
  @IsString({ message: 'Tên ngôn ngữ Tiếng Việt phải là một chuỗi ký tự!' })
  @IsNotEmpty({
    message: 'Nội dung tiếng Việt (vi) là bắt buộc và không được để trống',
  })
  vi!: string;

  @IsString({ message: 'Tên ngôn ngữ tiếng Anh phải là chuỗi ký tự' })
  @IsOptional() // Tiếng Anh có thể có hoặc không, tùy thuộc Admin bổ sung sau
  en?: string;
}
