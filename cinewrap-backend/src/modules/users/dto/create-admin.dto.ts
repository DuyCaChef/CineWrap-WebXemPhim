import { CreateUserDto } from './create-user.dto';
import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAdminDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Vai trò không được để trống khi tạo tài khoản hệ thống',
  })
  @IsIn(['ADMIN', 'MODERATOR', 'USER'], {
    message: 'Vai trò (role) không hợp lệ',
  })
  role!: string;

  @IsOptional()
  @IsIn(['FREE', 'VIP'], { message: 'Gói dịch vụ không hợp lệ' })
  subscription_type?: string;
}
