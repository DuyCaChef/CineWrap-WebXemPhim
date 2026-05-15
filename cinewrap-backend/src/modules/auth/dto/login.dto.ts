import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email không được để trống!' })
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @Matches(/@gmail\.com$/, {
    message: 'Hệ thống chỉ chấp nhận tài khoản có đuôi @gmail.com!',
  })
  email!: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái và một chữ số!',
  })
  password!: string;
}
