export class CreateUserDto {
  // Mật khẩu và email là bắt buộc, name là tùy chọn
  email!: string;
  password!: string;
  full_name?: string;
}
