import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express'; // Import Request từ express
import { ROLES_KEY } from '../decorators/roles.decorator';

// Định nghĩa Interface để TypeScript biết request của chúng ta có chứa user
interface RequestWithUser extends Request {
  user?: {
    id: number;
    role: string;
    [key: string]: any;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách Role yêu cầu từ Decorator @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu API không gắn @Roles, cho qua (Public)
    if (!requiredRoles) return true;

    // 2. Lấy thông tin request và ép kiểu tường minh về RequestWithUser
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // 3. Kiểm tra user và role (Đã an toàn nhờ interface RequestWithUser)
    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
