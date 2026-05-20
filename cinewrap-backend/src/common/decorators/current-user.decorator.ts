import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// 1. Khai báo kiểu dữ liệu chuẩn của User sau khi giải mã Token JWT
export class UserPayload {
  id!: number;
  email!: string;
  role!: string;
}

// 2. Định nghĩa Interface mở rộng cấu trúc Request để triệt tiêu kiểu 'any'
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// 3. Tạo Custom Decorator @CurrentUser() bọc kiểu an toàn
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    // Ép kiểu cho getRequest() sang cấu trúc interface đã chuẩn hóa
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    // Nếu request.user không tồn tại (trong trường hợp quên gắn JwtAuthGuard), ném ra object trống ép kiểu
    return request.user as UserPayload;
  },
);
