import { PrismaClient, CategoryType, CategoryStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu mẫu cho Categories...');

  // Danh sách thể loại mẫu
  const categories = [
    {
      type: CategoryType.GENRE,
      slug: 'hanh-dong',
      status: CategoryStatus.ACTIVE,
      name: { vi: 'Hành động', en: 'Action' },
      order: 1,
      isFeatured: true,
      showInMenu: true,
    },
    {
      type: CategoryType.GENRE,
      slug: 'khoa-hoc-vien-tuong',
      status: CategoryStatus.ACTIVE,
      name: { vi: 'Khoa học viễn tưởng', en: 'Sci-Fi' },
      order: 2,
      isFeatured: true,
      showInMenu: true,
    },
    {
      type: CategoryType.THEME,
      slug: 'anime',
      status: CategoryStatus.ACTIVE,
      name: { vi: 'Anime', en: 'Anime' },
      order: 3,
      isFeatured: false,
      showInMenu: true,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Nạp dữ liệu mẫu Categories hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
