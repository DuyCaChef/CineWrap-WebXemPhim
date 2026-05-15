import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  // --- VALIDATE EMAIL ---
  @IsNotEmpty({ message: 'Email không được để trống!' })
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @Matches(/@gmail\.com$/, {
    message: 'Hệ thống chỉ chấp nhận tài khoản có đuôi @gmail.com!',
  })
  email!: string;

  // --- VALIDATE PASSWORD ---
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi!' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái và một chữ số!',
  })
  password!: string;

  // --- VALIDATE FULL NAME ---
  @IsNotEmpty({ message: 'Họ và tên không được để trống!' })
  @IsString({ message: 'Họ và tên phải là một chuỗi!' })
  full_name!: string;
}
