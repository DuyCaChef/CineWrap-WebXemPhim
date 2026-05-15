import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

type JwtPayload = {
  sub: number;
  username: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Cách lấy token từ request header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 2. Kiểm tra token hết hạn hay chưa
      secretOrKey: process.env.JWT_ACCESS_SECRET!, // 3. Secret key để giải mã token
    });
  }

  // Nếu token hợp lệ, hàm validate sẽ được gọi với payload đã giải mã
  validate(payload: JwtPayload) {
    // 4. Trả về thông tin người dùng từ payload để gắn vào request.user
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
