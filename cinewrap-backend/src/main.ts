import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt Validation toàn cầu để tự động validate dữ liệu đầu vào dựa trên các DTO đã định nghĩa (CreateUserDto, UpdateUserDto, v.v...)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Pro-tip: Tự động loại bỏ các trường "rác" mà hacker cố tình nhét vào body (không có trong DTO)
      forbidNonWhitelisted: true, // Ném lỗi luôn nếu có trường rác
      transform: true, // Tự động chuyển đổi kiểu dữ liệu dựa trên type đã định nghĩa trong DTO (ví dụ: "age": "30" => age: 30)
    }),
  );

  // 1. Chống XSS bằng Helmet(Bảo vệ các HTTP Header)
  app.use(helmet());

  // 2. Kích hoạt đọc cookie từ client gửi lên
  app.use(cookieParser());

  // 3. Cấu hình CORS để chỉ cho phép các domain tin cậy truy cập API (Chống CSRF cơ bản)
  app.enableCors({
    origin: 'http://localhost:3000', // Chỉ cho phép frontend tại địa chỉ này truy cập API (React/Vite)
    credentials: true, // BẮT BUỘC để FE gửi được Cookie (Refresh Token) lên BE
  });

  // 4. Kích hoạt Validation toàn cầu để tự động validate dữ liệu đầu vào dựa trên các DTO đã định nghĩa (CreateUserDto, UpdateUserDto, v.v...)
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // 🚀 Bật CORS cho phép kết nối từ Vite
  app.enableCors({
    origin: true, // Cho phép tất cả nguồn kết nối local
    credentials: true,
  });

  await app.listen(3001); // BE và FE chạy trên 2 cổng khác nhau để dễ dàng cấu hình CORS (3000 cho FE, 3001 cho BE)
  console.log(`Server is running on: http://localhost:3001`);
}
bootstrap();
