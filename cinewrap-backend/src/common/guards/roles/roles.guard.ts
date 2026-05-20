import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

// Định nghĩa Interface để định hình cấu trúc dữ liệu user nằm trong Request, loại bỏ hoàn toàn kiểu 'any'
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy vai trò yêu cầu từ decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không có vai trò nào được yêu cầu, cho phép truy cập
    if (!requiredRoles) return true;

    // 2. Ép kiểu rõ ràng cho request thành AuthenticatedRequest để loại bỏ cảnh báo unsafe-assignment
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // 3. Kiểm tra user có role trong danh sách cho phép không
    if (user && requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này!');
  }
}
