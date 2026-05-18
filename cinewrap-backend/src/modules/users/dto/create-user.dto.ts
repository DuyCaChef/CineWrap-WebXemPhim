export class CreateUserDto {
  // Mật khẩu và email là bắt buộc, name là tùy chọn
  email!: string;
  password!: string;
  name?: string;
}
