import React from "react";

// DỮ LIỆU: CÁC TÍNH NĂNG NỔI BẬT - SECTION GENERAL
export const FEATURE_CARDS = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Tốc độ vượt trội",
    desc: "Công nghệ nén video tiên tiến giúp truyền tải hình ảnh 4K mượt mà ngay cả trên kết nối internet tiêu chuẩn, không giật lag.",
    accent: "border-l-cine-secondary",
    iconBg: "bg-cine-secondary/10 text-cine-secondary",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect
          x="2"
          y="3"
          width="20"
          height="14"
          rx="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      </svg>
    ),
    title: "Đa nền tảng",
    desc: "Trải nghiệm đồng nhất từ Smart TV, máy tính bảng đến điện thoại di động — giao diện thích ứng hoàn hảo trên mọi thiết bị.",
    accent: "border-l-cine-primary",
    iconBg: "bg-cine-primary/10 text-cine-primary",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Bảo mật tuyệt đối",
    desc: "Quyền riêng tư và dữ liệu của bạn được bảo vệ bởi các tiêu chuẩn mã hóa end-to-end hàng đầu thế giới.",
    accent: "border-l-emerald-500",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
];

// DỮ LIỆU: DANH SÁCH TAB
export const TABS = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "goi-dich-vu", label: "Gói dịch vụ" },
  { id: "tieu-chuan-dich-vu", label: "Tiêu chuẩn dịch vụ" },
  { id: "gia-tri-mang-lai", label: "Giá trị mang lại" },
];

// DỮ LIỆU: NỘI DUNG TỪNG TAB
export const TAB_ITEMS: Record<
  string,
  { icon: string; title: string; desc: string }[]
> = {
  "tong-quan": [
    {
      icon: "🎬",
      title: "Điện ảnh theo cách của bạn",
      desc: "Mang đến giao diện hiện đại, tập trung vào trải nghiệm người dùng, CineWrap đã tái định nghĩa cách chúng ta thưởng thức điện ảnh tại nhà, giúp bạn dễ dàng hòa mình vào mạch cảm xúc của bộ phim.",
    },
    {
      icon: "🍿",
      title: "Khám phá không giới hạn",
      desc: "Không chỉ dừng lại ở việc phát video, nền tảng phân loại phim theo các chủ đề nghệ thuật, dòng thời gian và đạo diễn. Giúp người dùng dễ dàng tiếp cận những tác phẩm phù hợp với tâm trạng và gu thẩm mỹ riêng.",
    },
  ],
  "goi-dich-vu": [
    {
      icon: "🎟️",
      title: "Gói Cơ bản",
      desc: "Truy cập hàng nghìn bộ phim chất lượng HD với giá ưu đãi. Phù hợp cho người dùng cá nhân muốn khám phá CineWrap.",
    },
    {
      icon: "⭐",
      title: "Gói Premium",
      desc: "Truy cập nội dung 4K +, kho phim độc quyền và trải nghiệm dịch vụ không giới hạn.",
    },
  ],
  "tieu-chuan-dich-vu": [
    {
      icon: "📱",
      title: "Tương thích đa thiết bị",
      desc: "Hệ thống được thiết kế linh hoạt để hiển thị hoàn hảo từ màn hình lớn của máy tính đến các thiết bị di động nhỏ gọn. Bạn có thể chuyển đổi thiết bị xem liên tục mà không làm gián đoạn trải nghiệm.",
    },
    {
      icon: "👁️‍🗨️",
      title: "Trọn vẹn từng câu thoại",
      desc: "Hệ thống phụ đề được thiết kế với font chữ chuyên dụng, đổ bóng điện ảnh dễ đọc và đồng bộ chính xác theo từng khung hình, tôn trọng tuyệt đối ý đồ truyền tải của nhà làm phim.",
    },
  ],
  "gia-tri-mang-lai": [
    {
      icon: "🌱",
      title: "Không gian xem phim sạch",
      desc: "CineWrap nói không với các quảng cáo pop-up, banner che khuất tầm nhìn hay các liên kết độc hại thường gặp trên các web xem phim lậu. Mang đến một môi trường xem phim an toàn, sạch sẽ và văn minh.",
    },
    {
      icon: "🔒",
      title: "Bảo mật và Riêng tư",
      desc: "Toàn bộ lịch sử xem, danh sách phim yêu thích và thông tin tùy chỉnh cá nhân của bạn được lưu trữ an toàn, bảo mật tuyệt đối, đảm bảo quyền riêng tư trọn vẹn cho từng người dùng.",
    },
  ],
};

// LƯU Ý: Trong các bước tiếp theo khi bóc tách PrivacySection, TermsSection và SupportSection,
// chúng ta sẽ tiếp tục cắt các mảng nội dung FAQ và Điều khoản dán thêm vào file này!
