import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryStatus, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  // Bổ sung Constructor để tiêm PrismaService vào sử dụng toàn file
  constructor(private readonly prisma: PrismaService) {}

  // ====================================================================
  // 1. TÍNH NĂNG: TẠO MỚI DANH MỤC (CREATE)
  // ====================================================================
  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    // Ràng buộc 1: Kiểm tra tính duy nhất của Slug
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });
    if (existingCategory) {
      throw new BadRequestException(
        'Đường dẫn URL (slug) đã tồn tại trong hệ thống. Vui lòng chọn một slug khác.',
      );
    }

    // Ràng buộc 2: Kiểm tra tính duy nhất của Tên tiếng Việt trong trường JSON
    const existingName = await this.prisma.category.findFirst({
      where: {
        name: {
          path: ['vi'],
          equals: createCategoryDto.name.vi,
        },
      },
    });
    if (existingName) {
      throw new BadRequestException(
        `Tên danh mục tiếng Việt '${createCategoryDto.name.vi}' đã được sử dụng!. Vui lòng chọn một tên khác.`,
      );
    }

    // Tiến hành lưu vào Database kèm theo Audit Log
    return this.prisma.category.create({
      data: {
        type: createCategoryDto.type,
        slug: createCategoryDto.slug,
        status: createCategoryDto.status,
        order: createCategoryDto.order,
        icon: createCategoryDto.icon,
        banner: createCategoryDto.banner,
        color: createCategoryDto.color,
        isFeatured: createCategoryDto.isFeatured,
        showInMenu: createCategoryDto.showInMenu,
        showInHome: createCategoryDto.showInHome,
        // Ép kiểu tường minh sang InputJsonValue để làm hài lòng bộ biên dịch Prisma
        name: createCategoryDto.name as unknown as Prisma.InputJsonValue,
        description:
          createCategoryDto.description as unknown as Prisma.InputJsonValue,
        displayName:
          createCategoryDto.displayName as unknown as Prisma.InputJsonValue,
        metaTitle: createCategoryDto.metaTitle,
        metaDescription: createCategoryDto.metaDescription,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  // ====================================================================
  // 2. TÍNH NĂNG: XEM CHI TIẾT DANH MỤC (RETRIEVE DETAIL)
  // ====================================================================
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category || category.status === CategoryStatus.DELETED) {
      throw new NotFoundException(
        `Danh mục với ID ${id} không tồn tại hoặc đã bị xóa khỏi hệ thống.`,
      );
    }

    return category;
  }

  // ====================================================================
  // 3. TÍNH NĂNG: CẬP NHẬT DANH MỤC (UPDATE)
  // ====================================================================
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    // Đảm bảo danh mục phải tồn tại trước khi cho phép sửa
    await this.findOne(id);

    // Nếu cập nhật lại slug, phải kiểm tra trùng lặp
    if (updateCategoryDto.slug) {
      const existingSlug = await this.prisma.category.findFirst({
        where: {
          slug: updateCategoryDto.slug,
          id: { not: id },
        },
      });
      if (existingSlug) {
        throw new BadRequestException(
          `Đường dẫn URL (slug) '${updateCategoryDto.slug}' này đã được sử dụng bởi danh mục khác!`,
        );
      }
    }

    // Nếu cập nhật lại Tên, kiểm tra trùng lặp trong dữ liệu JSON
    if (updateCategoryDto.name?.vi) {
      const existingName = await this.prisma.category.findFirst({
        where: {
          id: { not: id },
          name: {
            path: ['vi'],
            equals: updateCategoryDto.name.vi,
          },
        },
      });
      if (existingName) {
        throw new BadRequestException(
          `Tên danh mục tiếng Việt '${updateCategoryDto.name.vi}' đã được sử dụng bởi danh mục khác!`,
        );
      }
    }

    // BÓC TÁCH DỮ LIỆU NÂNG CAO: Tách các trường JSON Class ra khỏi cấu trúc dữ liệu thô
    const { name, description, displayName, ...restFields } = updateCategoryDto;

    // Tiến hành cập nhật an toàn tuyệt đối
    return this.prisma.category.update({
      where: { id },
      data: {
        ...restFields,
        // Chỉ nạp và ép kiểu dữ liệu JSON khi Admin thực sự truyền chúng lên để chỉnh sửa
        ...(name && { name: name as unknown as Prisma.InputJsonValue }),
        ...(description && {
          description: description as unknown as Prisma.InputJsonValue,
        }),
        ...(displayName && {
          displayName: displayName as unknown as Prisma.InputJsonValue,
        }),
        updatedBy: userId,
      },
    });
  }

  // ====================================================================
  // 4. TÍNH NĂNG: XÓA MỀM THÔNG MINH / TỰ ĐỘNG LƯU TRỮ (DELETE/ARCHIVE)
  // ====================================================================
  async remove(id: number, userId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            movies: true,
            episodes: true,
          },
        },
      },
    });

    if (!category || category.status === CategoryStatus.DELETED) {
      throw new NotFoundException(
        `Danh mục với ID ${id} không tồn tại hoặc đã bị xóa khỏi hệ thống.`,
      );
    }

    // Kịch bản Tự động lưu trữ (Auto Archive)
    if (category._count.movies > 0 || category._count.episodes > 0) {
      await this.prisma.category.update({
        where: { id },
        data: {
          status: CategoryStatus.ARCHIVED,
          updatedBy: userId,
        },
      });
      return {
        success: true,
        message: `Danh mục này đang được gán cho ${category._count.movies} bộ phim và ${category._count.episodes} tập phim. Hệ thống đã tự động chuyển trạng thái của danh mục sang 'ARCHIVED' (Lưu trữ) để an toàn cho dữ liệu liên kết.`,
      };
    }

    // Kịch bản Xóa mềm (Soft Delete)
    await this.prisma.category.update({
      where: { id },
      data: {
        status: CategoryStatus.DELETED,
        updatedBy: userId,
      },
    });

    return {
      success: true,
      message: 'Xóa mềm danh mục thành công!',
    };
  }

  // ====================================================================
  // HÀM HỖ TRỢ NỘI BỘ: PHÂN RÃ ĐA NGÔN NGỮ (LOCALE RESOLVER)
  // ====================================================================
  private formatLocale(category: Category, locale?: string) {
    // Nếu Client không yêu cầu ngôn ngữ cụ thể, trả về nguyên gốc object JSON
    if (!locale) {
      return category;
    }

    // Ép kiểu an toàn (Safe Type Casting) để TypeScript hiểu cấu trúc JSON đa ngôn ngữ
    const nameObj = category.name as Record<string, string>;
    const descriptionObj = category.description as Record<
      string,
      string
    > | null;
    const displayNameObj = category.displayName as Record<
      string,
      string
    > | null;

    return {
      ...category,
      // Cố gắng lấy ngôn ngữ được yêu cầu (Vd: en).
      // Nếu không có, lui về (fallback) lấy tiếng Việt (vi).
      // Nếu vẫn không có, trả về giá trị gốc để không bị null.
      name: nameObj?.[locale] || nameObj?.['vi'] || category.name,
      description: descriptionObj
        ? descriptionObj[locale] || descriptionObj['vi']
        : category.description,
      displayName: displayNameObj
        ? displayNameObj[locale] || displayNameObj['vi']
        : category.displayName,
    };
  }

  // ====================================================================
  // 5. TÍNH NĂNG: LẤY DANH SÁCH & PHÂN TRANG NÂNG CAO (FIND ALL)
  // ====================================================================
  async findAll(query: QueryCategoryDto) {
    // Bóc tách toàn bộ các tham số mà Client gửi lên từ thanh URL
    // BÓC TÁCH VÀ GÁN GIÁ TRỊ MẶC ĐỊNH (Chống lỗi undefined của TypeScript)
    const {
      status,
      type,
      isFeatured,
      locale,
      sortBy = 'order', // Mặc định sort theo 'order' nếu không truyền
      sortOrder = 'asc', // Mặc định tăng dần
      page = 1, // Mặc định trang 1
      limit = 10, // Mặc định 10 dòng
    } = query;

    // 1.Tính toán Phân trang (Pagination Math)
    const skip = (page - 1) * limit;
    const take = limit;

    // 2.Xây dựng Điều kiện Lọc động (Dynamic Filter)
    // Cấp kiểu Prisma.CategoryWhereInput để TypeScript hỗ trợ gợi ý code an toàn
    const where: Prisma.CategoryWhereInput = {};

    if (status) {
      where.status = status; // Lọc theo trạng thái Admin yêu cầu (Vd: DRAFT)
    } else {
      // MẶC ĐỊNH AN TOÀN: Bỏ qua toàn bộ các danh mục đã xóa mềm
      where.status = { not: CategoryStatus.DELETED };
    }

    if (type) {
      where.type = type; // Lọc theo loại danh mục (Vd: THEME, GENRE)
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured; // Lọc theo danh mục nổi bật (true/false)
    }

    // 3.Truy vấn Song song Tốc độ cao (Parallel Transaction)
    // Chạy đồng thời lệnh lấy dữ liệu và lệnh đếm tổng số bản ghi
    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where, // Đưa bộ lọc động vào
        orderBy: { [sortBy]: sortOrder }, // Sắp xếp theo yêu cầu của Client
        skip, // Bỏ qua số bản ghi
        take, // Lấy về số bản ghi
      }),
      this.prisma.category.count({ where }), // Đếm tổng số lượng thỏa mãn điều kiện
    ]);

    // 4. Định dạng Đa ngôn ngữ (Locale Formatting)
    // Chạy qua vòng lặp để dịch cấu trúc JSON của từng danh mục
    const formattedCategories = categories.map((cat) =>
      this.formatLocale(cat, locale),
    );

    // 5. Tính toán Tổng số trang và Trả về chuẩn Enterprise
    const totalPages = Math.ceil(total / limit);

    return {
      data: formattedCategories,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  // ====================================================================
  // 6. GÁN DANH MỤC VÀO PHIM (ATTACH)
  // ====================================================================
  async attachToMovie(categoryId: number, movieId: number) {
    return this.prisma.movieCategory.create({
      data: { categoryId, movieId },
    });
  }

  // ====================================================================
  // 7. GỠ DANH MỤC KHỎI PHIM (DETACH)
  // ====================================================================
  async detachFromMovie(categoryId: number, movieId: number) {
    return this.prisma.movieCategory.delete({
      // Sử dụng Khóa chính phức hợp (Composite Key) đã thiết kế trong schema
      where: { movieId_categoryId: { categoryId, movieId } },
    });
  }
}
