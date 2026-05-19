import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  // Mật khẩu và email là bắt buộc, name là tùy chọn
  // 1. Phải là định dạng Email, không được bỏ trống
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  // 2. Mật khẩu phải có ít nhất 6 ký tự
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password!: string;

  // 3. Họ tên là tùy chọn
  @IsOptional()
  @IsString()
  full_name?: string;

  // 4. Vai trò là tùy chọn, chỉ cho phép 1 tron 3 giá trị: USER, ADMIN, MODERATOR
  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'MODERATOR'], {
    message: 'Vai trò (role) không hợp lệ',
  })
  role?: string; // USER, ADMIN, MODERATOR....

  // 5. Gói đăng ký là tùy chọn, chỉ được phép 1 trong 2 giá trị: FREE, VIP
  @IsOptional()
  @IsIn(['FREE', 'VIP'], { message: 'Gói dịch vụ không hợp lệ' })
  subscription_type?: string; // FREE, PREMIUM, VIP....
}
