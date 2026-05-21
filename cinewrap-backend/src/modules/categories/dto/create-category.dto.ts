import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryType, CategoryStatus } from '@prisma/client'; // Import trực tiếp từ Prisma Client mà chúng ta vừa Migrate ở Bước 1
import { LocaleStringDto } from './locale-string.dto';

export class CreateCategoryDto {
  @IsEnum(CategoryType, {
    message:
      'Loại danh mục (type) không hợp lệ. Phải thuộc: GENRE, THEME, MOOD, COLLECTION, HIGHLIGHT',
  })
  @IsNotEmpty({
    message: 'Loại danh mục (type) là bắt buộc và không được để trống',
  })
  type!: CategoryType;

  @IsString({ message: 'Slug phải là một chuỗi ký tự!' })
  @IsNotEmpty({
    message: 'Slug đường dẫn là bắt buộc và không được để trống',
  })
  slug!: string;

  @IsEnum(CategoryStatus, {
    message:
      'Trạng thái (status) không hợp lệ. Phải thuộc: DRAFT, ACTIVE, ARCHIVED, DELETED',
  })
  @IsOptional()
  status?: CategoryStatus = CategoryStatus.DRAFT; // Mặc định khi tạo mới sẽ ở dạng nháp (DRAFT) để an toàn

  @IsInt({ message: 'Thứ tự hiển thị phải là số nguyên' })
  @Min(0, { message: 'Thứ tự hiển thị nhỏ nhất là 0' })
  @IsOptional()
  order?: number = 0;

  @IsString({ message: 'Đường dẫn Icon phải là chuỗi ký tự' })
  @IsOptional()
  icon?: string;

  @IsString({ message: 'Đường dẫn Banner phải là chuỗi ký tự' })
  @IsOptional()
  banner?: string;

  @IsString({ message: 'Mã màu sắc render UI phải là chuỗi ký tự' })
  @IsOptional()
  color?: string;

  @IsBoolean({ message: 'Trường nổi bật phải là kiểu dữ liệu true/false' })
  @IsOptional()
  isFeatured?: boolean = false;

  @IsBoolean({ message: 'Cấu hình Menu phải là kiểu dữ liệu true/false' })
  @IsOptional()
  showInMenu?: boolean = false;

  @IsBoolean({ message: 'Cấu hình Trang chủ phải là kiểu dữ liệu true/false' })
  @IsOptional()
  showInHome?: boolean = false;

  // ==================== VALIDATE CÁC TRƯỜNG ĐA NGÔN NGỮ (JSON) ====================

  @ValidateNested() // Bắt buộc kiểm tra sâu vào cấu trúc bên trong object
  @Type(() => LocaleStringDto) // Ánh xạ kiểu dữ liệu sang DTO con để class-validator hiểu
  @IsNotEmpty({
    message: 'Trường tên danh mục (name) không được để trống cấu trúc ngôn ngữ',
  })
  name!: LocaleStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocaleStringDto)
  description?: LocaleStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocaleStringDto)
  displayName?: LocaleStringDto;

  // ==================== SEO & DISCOVERABILITY ====================

  @IsString({ message: 'Meta Title phải là chuỗi ký tự' })
  @IsOptional()
  metaTitle?: string;

  @IsString({ message: 'Meta Description phải là chuỗi ký tự' })
  @IsOptional()
  metaDescription?: string;
}
