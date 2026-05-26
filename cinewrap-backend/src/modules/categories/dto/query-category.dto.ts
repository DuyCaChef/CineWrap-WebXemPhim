// DTO chuyên biệt để bắt các tham số trên thanh URL (Query Parameters) khi Client thực hiện lệnh GET /categories?page=1&limit=10
// Đáp ứng yêu cầu Listing, Lọc theo trạng thái, featured, locale, sắp xếp và phân trang chuẩn
import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CategoryStatus, CategoryType } from '@prisma/client';

export class QueryCategoryDto {
  @IsOptional()
  @IsEnum(CategoryStatus, { message: 'Trạng thái lọc không hợp lệ' })
  status?: CategoryStatus;

  @IsOptional()
  @IsEnum(CategoryType, { message: 'Loại danh mục lọc không hợp lệ' })
  type?: CategoryType;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    return value === 'true' || value === true;
  })
  @IsBoolean({ message: 'isFeatured phải là kiểu true hoặc false' })
  isFeatured?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    return value === 'true' || value === true;
  })
  @IsBoolean()
  showInMenu?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    return value === 'true' || value === true;
  })
  @IsBoolean()
  showInHome?: boolean;

  @IsOptional()
  @IsString({ message: 'Locale phải là chuỗi ký tự (Vd: vi, en)' })
  locale?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'sortOrder chỉ được phép là asc hoặc desc',
  })
  sortBy?: string = 'order';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';

  // ================= PHÂN TRANG CHUẨN ENTERPRISE (ĐÃ SỬA ĐỂ KHỚP ESLINT) =================
  @IsOptional()
  // Sử dụng String(value) để ép kiểu dữ liệu any thành string an toàn cho hàm parseInt
  @Transform(({ value }) => parseInt(String(value), 10))
  @IsInt()
  @Min(1, { message: 'Số trang thấp nhất phải là trang 1' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(String(value), 10))
  @IsInt()
  @Min(1, { message: 'Kích thước trang phải lớn hơn 0' })
  limit?: number = 10;
}
