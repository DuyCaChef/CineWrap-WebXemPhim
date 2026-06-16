import React from "react";

// ============================================================================
// DỮ LIỆU CHO SECTION THÔNG TIN CHUNG (GENERAL SECTION)
// ============================================================================

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

// ============================================================================
// DỮ LIỆU CHO SECTION CHÍNH SÁCH BẢO MẬT (PRIVACY SECTION)
// ============================================================================

// DỮ LIỆU: 4 HUY HIỆU THỐNG KÊ BẢO MẬT
export const PRIVACY_STATS = [
  {
    icon: (
      <svg
        className="w-5 h-5"
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
    value: "End-to-End",
    label: "Mã hoá dữ liệu",
    color: "text-cine-secondary",
    bg: "bg-cine-secondary/10 border-cine-secondary/20",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="10" strokeLinecap="round" />
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    value: "72 giờ",
    label: "Thời gian xử lý yêu cầu",
    color: "text-cine-primary",
    bg: "bg-cine-primary/10 border-cine-primary/20",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="7" r="4" strokeLinecap="round" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
      </svg>
    ),
    value: "Không bán",
    label: "Dữ liệu cho bên thứ ba",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
        <path
          d="M19 6l-1 14H6L5 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 11v6M14 11v6" strokeLinecap="round" />
        <path d="M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    value: "Xoá ngay",
    label: "Theo yêu cầu người dùng",
    color: "text-cine-warn",
    bg: "bg-cine-warn/10 border-cine-warn/20",
  },
];

// DỮ LIỆU: DANH SÁCH ACCORDION CHI TIẾT
// 2. DỮ LIỆU: DANH SÁCH ACCORDION CHI TIẾT (CHÍNH SÁCH BẢO MẬT)
export const PRIVACY_ACCORDION_DATA = [
  {
    id: "thu-thap",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="7 10 12 15 17 10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
      </svg>
    ),
    title: "1. Dữ liệu chúng tôi thu thập",
    summary: "Thông tin tài khoản, lịch sử xem, thiết bị và cookies cần thiết.",
    content: (
      <ul className="space-y-3 text-cine-text-muted text-sm leading-relaxed">
        <li className="flex gap-3">
          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
          <span>
            <span className="text-cine-text font-semibold">
              Thông tin tài khoản:
            </span>{" "}
            Họ tên, địa chỉ email, mật khẩu đã mã hoá, ảnh đại diện (tùy chọn)
            khi bạn đăng ký.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
          <span>
            <span className="text-cine-text font-semibold">
              Hành vi sử dụng:
            </span>{" "}
            Phim đã xem, thời lượng xem, danh sách yêu thích và các tương tác
            tìm kiếm.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
          <span>
            <span className="text-cine-text font-semibold">
              Thiết bị & kết nối:
            </span>{" "}
            Loại thiết bị, hệ điều hành, trình duyệt, địa chỉ IP ẩn danh và múi
            giờ.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
          <span>
            <span className="text-cine-text font-semibold">
              Cookies thiết yếu:
            </span>{" "}
            Phiên đăng nhập, ngôn ngữ ưa thích và cài đặt chất lượng video.
            Không dùng cookie quảng cáo.
          </span>
        </li>
      </ul>
    ),
  },
  {
    id: "su-dung",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="3" strokeLinecap="round" />
        <path
          d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "2. Cách chúng tôi sử dụng dữ liệu",
    summary:
      "Cá nhân hoá, cải thiện dịch vụ và bảo mật tài khoản — không quảng cáo.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {[
          {
            icon: "🎯",
            title: "Cá nhân hoá nội dung",
            desc: "Gợi ý phim phù hợp với lịch sử xem và thể loại yêu thích của bạn.",
          },
          {
            icon: "⚙️",
            title: "Cải thiện hệ thống",
            desc: "Phân tích hiệu suất phát video và tốc độ tải để nâng cấp trải nghiệm.",
          },
          {
            icon: "🔐",
            title: "Bảo mật tài khoản",
            desc: "Phát hiện đăng nhập bất thường và bảo vệ tài khoản khỏi truy cập trái phép.",
          },
          {
            icon: "📩",
            title: "Thông báo dịch vụ",
            desc: "Gửi email về thay đổi chính sách, cập nhật bảo mật — không spam marketing.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="flex gap-3 p-4 bg-cine-bg-primary/50 rounded-xl border border-white/5"
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <div>
              <p className="text-cine-text font-semibold mb-1">{item.title}</p>
              <p className="text-cine-text-muted text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "chia-se",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="18" cy="5" r="3" strokeLinecap="round" />
        <circle cx="6" cy="12" r="3" strokeLinecap="round" />
        <circle cx="18" cy="19" r="3" strokeLinecap="round" />
        <line
          x1="8.59"
          y1="13.51"
          x2="15.42"
          y2="17.49"
          strokeLinecap="round"
        />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeLinecap="round" />
      </svg>
    ),
    title: "3. Chia sẻ với bên thứ ba",
    summary:
      "Dữ liệu của bạn không bao giờ được bán. Chia sẻ giới hạn và có kiểm soát.",
    content: (
      <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex gap-3">
          <svg
            className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
              strokeLinecap="round"
            />
            <polyline
              points="22 4 12 14.01 9 11.01"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>
            <span className="text-emerald-400 font-semibold">
              Cam kết cốt lõi:{" "}
            </span>
            CineWrap tuyệt đối không bán, không cho thuê và không trao đổi dữ
            liệu cá nhân của bạn với bất kỳ bên quảng cáo nào.
          </p>
        </div>
        <p>
          Chúng tôi chỉ chia sẻ dữ liệu trong các trường hợp sau, với phạm vi
          tối thiểu cần thiết:
        </p>
        <ul className="space-y-2">
          {[
            "Nhà cung cấp dịch vụ đám mây (lưu trữ video, CDN) — có hợp đồng bảo mật dữ liệu ràng buộc.",
            "Xử lý thanh toán — chỉ thông tin giao dịch, không lưu số thẻ trên hệ thống CineWrap.",
            "Yêu cầu pháp lý hợp lệ từ cơ quan chức năng — có thông báo cho người dùng khi được phép.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-primary flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "quyen",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7" r="4" strokeLinecap="round" />
      </svg>
    ),
    title: "4. Quyền của bạn",
    summary: "Truy cập, sửa, xuất hoặc xoá dữ liệu bất kỳ lúc nào.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        {[
          {
            icon: (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" />
              </svg>
            ),
            title: "Xem & Xuất",
            desc: "Tải toàn bộ dữ liệu tài khoản dưới dạng JSON hoặc CSV từ trang Cài đặt.",
            accent: "border-cine-secondary/30 text-cine-secondary",
          },
          {
            icon: (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            title: "Chỉnh sửa",
            desc: "Cập nhật thông tin cá nhân, sở thích nội dung và cài đặt thông báo trực tiếp.",
            accent: "border-cine-primary/30 text-cine-primary",
          },
          {
            icon: (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
                <path
                  d="M19 6l-1 14H6L5 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M10 11v6M14 11v6" strokeLinecap="round" />
              </svg>
            ),
            title: "Xoá tài khoản",
            desc: "Xoá toàn bộ dữ liệu vĩnh viễn trong vòng 30 ngày theo yêu cầu. Không thể hoàn tác.",
            accent: "border-cine-warn/30 text-cine-warn",
          },
        ].map((right) => (
          <div
            key={right.title}
            className={`p-5 rounded-xl border bg-cine-bg-primary/40 flex flex-col gap-3 ${right.accent.split(" ")[0]}`}
          >
            <div className={right.accent.split(" ")[1]}>{right.icon}</div>
            <p className="text-cine-text font-semibold">{right.title}</p>
            <p className="text-cine-text-muted text-xs leading-relaxed">
              {right.desc}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "luu-tru",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" strokeLinecap="round" />
        <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" strokeLinecap="round" />
        <path
          d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "5. Lưu trữ & Bảo mật kỹ thuật",
    summary: "Máy chủ tại Việt Nam, mã hoá AES-256, kiểm tra bảo mật định kỳ.",
    content: (
      <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Vị trí lưu trữ",
              value:
                "Máy chủ đặt tại Việt Nam, tuân thủ Luật An ninh mạng 2018.",
              icon: "🏛️",
            },
            {
              label: "Chuẩn mã hoá",
              value:
                "AES-256 cho dữ liệu lưu trữ, TLS 1.3 cho dữ liệu truyền tải.",
              icon: "🔐",
            },
            {
              label: "Kiểm tra định kỳ",
              value:
                "Đánh giá bảo mật độc lập mỗi 6 tháng và vá lỗi tức thời khi phát hiện.",
              icon: "🧪",
            },
            {
              label: "Thời gian lưu trữ",
              value:
                "Dữ liệu hoạt động: trong suốt thời gian sử dụng. Dữ liệu log hệ thống: tối đa 90 ngày.",
              icon: "📅",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex gap-3 p-4 bg-cine-bg-primary/50 rounded-xl border border-white/5"
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-cine-text font-semibold mb-1">
                  {item.label}
                </p>
                <p className="text-xs leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "lien-he",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          strokeLinecap="round"
        />
        <polyline
          points="22,6 12,13 2,6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "6. Liên hệ về quyền riêng tư",
    summary:
      "Gửi yêu cầu hoặc khiếu nại về dữ liệu qua email hoặc form trực tiếp.",
    content: (
      <div className="space-y-4 text-sm">
        <p className="text-cine-text-muted leading-relaxed">
          Mọi yêu cầu liên quan đến quyền riêng tư — truy cập dữ liệu, chỉnh
          sửa, xoá hoặc khiếu nại — sẽ được xử lý trong vòng{" "}
          <span className="text-cine-text font-semibold">72 giờ làm việc</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:privacy@cinewrap.vn"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-cine-secondary/10 border border-cine-secondary/30 text-cine-secondary text-sm font-semibold hover:bg-cine-secondary/20 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            privacy@cinewrap.vn
          </a>
          {/* Nút form hỗ trợ. Lưu ý: onClick cuộn trang sẽ được xử lý lại bằng sự kiện onclick thuần vì ta đang ở JSX của file Data */}
          <a
            href="#support"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-cine-primary/10 border border-cine-primary/30 text-cine-primary text-sm font-semibold hover:bg-cine-primary/20 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Form hỗ trợ trực tiếp
          </a>
        </div>
      </div>
    ),
  },
];

// ============================================================================
// DỮ LIỆU CHO SECTION ĐIỀU KHOẢN SỬ DỤNG (TERMS SECTION)
// ============================================================================

export const TERMS_CHIPS = [
  { icon: "🤝", text: "Tôn trọng quyền riêng tư" },
  { icon: "📜", text: "Cam kết minh bạch dịch vụ" },
  { icon: "🔔", text: "Thông báo trước mọi thay đổi" },
];

export const TERMS_TABS = [
  {
    id: "user",
    label: "Quyền & Nghĩa vụ người dùng",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7" r="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "platform",
    label: "Cam kết từ CineWrap",
    icon: (
      <svg
        className="w-4 h-4"
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
  },
] as const;

export const TERMS_USER_DATA = [
  {
    id: "dk-tai-khoan",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7" r="4" strokeLinecap="round" />
      </svg>
    ),
    title: "1. Điều kiện tạo tài khoản",
    summary: "Độ tuổi tối thiểu, thông tin xác thực và trách nhiệm bảo mật.",
    content: (
      <ul className="space-y-3 text-cine-text-muted text-sm leading-relaxed">
        {[
          {
            label: "Độ tuổi tối thiểu",
            desc: "Bạn phải đủ 13 tuổi trở lên để đăng ký tài khoản. Người dùng dưới 18 tuổi cần có sự đồng ý của phụ huynh hoặc người giám hộ hợp pháp.",
          },
          {
            label: "Thông tin trung thực",
            desc: "Bạn cam kết cung cấp tên, email và thông tin thanh toán chính xác. Tài khoản được lập bằng thông tin giả mạo sẽ bị xoá mà không cần báo trước.",
          },
          {
            label: "Bảo mật tài khoản",
            desc: "Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động phát sinh từ tài khoản của mình. Hãy thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.",
          },
          {
            label: "Mỗi người — một tài khoản",
            desc: "Mỗi cá nhân chỉ được sở hữu một tài khoản. Việc tạo nhiều tài khoản để lách giới hạn dịch vụ là vi phạm điều khoản.",
          },
        ].map((item) => (
          <li key={item.label} className="flex gap-3">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cine-secondary flex-shrink-0" />
            <span>
              <span className="text-cine-text font-semibold">
                {item.label}:{" "}
              </span>
              {item.desc}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "dk-su-dung",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <polygon
          points="23 7 16 12 23 17 23 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="1" y="5" width="15" height="14" rx="2" strokeLinecap="round" />
      </svg>
    ),
    title: "2. Quy tắc sử dụng nội dung",
    summary:
      "Những gì được phép và không được phép khi xem phim trên CineWrap.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <p className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                strokeLinecap="round"
              />
              <polyline
                points="22 4 12 14.01 9 11.01"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Được phép
          </p>
          {[
            "Xem phim cho mục đích cá nhân, phi thương mại",
            "Chia sẻ đường link bài phim lên mạng xã hội",
            "Tải xuống (nếu tính năng được kích hoạt) để xem offline",
            "Viết đánh giá và bình luận mang tính xây dựng",
          ].map((item) => (
            <p key={item} className="text-cine-text-muted text-xs flex gap-2">
              <span className="text-emerald-400 flex-shrink-0">·</span>
              {item}
            </p>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-cine-warn/20 bg-cine-warn/5 space-y-2">
          <p className="text-cine-warn font-bold mb-3 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" />
              <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" />
            </svg>
            Không được phép
          </p>
          {[
            "Ghi hình, chụp màn hình để phân phối lại",
            "Dùng VPN hoặc proxy để lách giới hạn vùng nội dung",
            "Bán lại hoặc cho thuê quyền truy cập tài khoản",
            "Sử dụng bot, script để tự động duyệt hoặc tải nội dung",
          ].map((item) => (
            <p key={item} className="text-cine-text-muted text-xs flex gap-2">
              <span className="text-cine-warn flex-shrink-0">·</span>
              {item}
            </p>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dk-thanh-toan",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" />
        <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round" />
      </svg>
    ),
    title: "3. Thanh toán & Hoàn tiền",
    summary: "Chính sách gói dịch vụ, gia hạn tự động và điều kiện hoàn tiền.",
    content: (
      <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              icon: "🔄",
              label: "Gia hạn tự động",
              desc: "Gói đăng ký sẽ tự động gia hạn vào ngày hết hạn. Bạn có thể huỷ bất cứ lúc nào trước 24 giờ chu kỳ tiếp theo.",
              border: "border-cine-secondary/20",
            },
            {
              icon: "💳",
              label: "Phương thức thanh toán",
              desc: "Hỗ trợ thẻ tín dụng/ghi nợ, ví điện tử MoMo, ZaloPay và chuyển khoản ngân hàng nội địa.",
              border: "border-cine-primary/20",
            },
            {
              icon: "↩️",
              label: "Hoàn tiền",
              desc: "Chấp nhận yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày thanh toán nếu dịch vụ gặp sự cố kỹ thuật nghiêm trọng từ phía CineWrap.",
              border: "border-emerald-500/20",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl border ${item.border} bg-cine-bg-primary/40 flex flex-col gap-2`}
            >
              <span className="text-xl">{item.icon}</span>
              <p className="text-cine-text font-semibold text-xs">
                {item.label}
              </p>
              <p className="text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-white/8 bg-cine-bg-primary/30 flex gap-3">
          <svg
            className="w-5 h-5 text-cine-primary flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
          </svg>
          <p className="text-xs leading-relaxed">
            Giá gói dịch vụ có thể thay đổi. CineWrap sẽ thông báo qua email ít
            nhất <span className="text-cine-text font-semibold">30 ngày</span>{" "}
            trước khi mức giá mới có hiệu lực.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "dk-ban-quyen",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="10" strokeLinecap="round" />
        <path d="M14.83 14.83a4 4 0 1 1 0-5.66" strokeLinecap="round" />
      </svg>
    ),
    title: "4. Bản quyền & Sở hữu trí tuệ",
    summary: "Toàn bộ nội dung được bảo hộ — vi phạm có thể bị xử lý pháp lý.",
    content: (
      <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
        <p>
          Tất cả nội dung trên CineWrap — bao gồm phim, trailer, hình ảnh, logo,
          giao diện và mã nguồn — đều thuộc quyền sở hữu của CineWrap hoặc được
          cấp phép hợp lệ từ các đối tác phân phối.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              type: "Nội dung phim",
              rule: "Bảo hộ theo Luật Sở hữu trí tuệ Việt Nam và Công ước Berne. Mọi hành vi sao chép, phân phối trái phép đều có thể bị truy cứu trách nhiệm hình sự.",
            },
            {
              type: "Giao diện & mã nguồn",
              rule: "Thiết kế giao diện, logo và toàn bộ mã nguồn front-end là tài sản độc quyền của CineWrap, không được sao chép hay tái sử dụng.",
            },
            {
              type: "Nội dung người dùng tạo",
              rule: "Bình luận và đánh giá bạn đăng lên CineWrap vẫn thuộc quyền sở hữu của bạn, nhưng bạn cấp cho chúng tôi giấy phép hiển thị trên nền tảng.",
            },
            {
              type: "Báo cáo vi phạm",
              rule: "Nếu phát hiện nội dung vi phạm bản quyền, vui lòng liên hệ copyright@cinewrap.vn — chúng tôi xử lý trong vòng 48 giờ.",
            },
          ].map((item) => (
            <div
              key={item.type}
              className="p-4 rounded-xl border border-white/5 bg-cine-bg-primary/40 flex gap-3"
            >
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cine-primary flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-cine-text font-semibold mb-1 text-xs">
                  {item.type}
                </p>
                <p className="text-xs leading-relaxed">{item.rule}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export const TERMS_PLATFORM_DATA = [
  {
    id: "cam-ket-dich-vu",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" />
        <polyline
          points="22 4 12 14.01 9 11.01"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "5. Cam kết chất lượng dịch vụ",
    summary: "Uptime, tốc độ và tiêu chuẩn chất lượng CineWrap đảm bảo.",
    content: (
      <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              value: "99.5%",
              label: "Uptime cam kết",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
            {
              value: "< 2s",
              label: "Thời gian tải trang",
              color: "text-cine-secondary",
              bg: "bg-cine-secondary/10 border-cine-secondary/20",
            },
            {
              value: "4K",
              label: "Độ phân giải tối đa",
              color: "text-cine-primary",
              bg: "bg-cine-primary/10 border-cine-primary/20",
            },
            {
              value: "24/7",
              label: "Giám sát hệ thống",
              color: "text-cine-text",
              bg: "bg-white/5 border-white/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-xl border ${stat.bg} flex flex-col gap-1`}
            >
              <p className={`text-xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-cine-text-muted text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
        <p>
          Trong trường hợp downtime vượt quá mức cam kết, CineWrap sẽ tự động
          gia hạn gói dịch vụ của bạn tương ứng với thời gian gián đoạn, không
          cần yêu cầu.
        </p>
      </div>
    ),
  },
  {
    id: "gioi-han-trach-nhiem",
    icon: (
      <svg
        className="w-5 h-5"
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
        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
      </svg>
    ),
    title: "6. Giới hạn trách nhiệm",
    summary: "Những trường hợp CineWrap không chịu trách nhiệm pháp lý.",
    content: (
      <div className="space-y-3 text-sm text-cine-text-muted leading-relaxed">
        <p>
          CineWrap cung cấp dịch vụ theo dạng "nguyên trạng" và không chịu trách
          nhiệm trong các trường hợp sau:
        </p>
        <ul className="space-y-2.5">
          {[
            "Mất dữ liệu do lỗi thiết bị hoặc kết nối internet phía người dùng.",
            "Gián đoạn dịch vụ do sự cố bất khả kháng (thiên tai, chiến tranh mạng quy mô lớn, quyết định từ cơ quan nhà nước).",
            "Nội dung bình luận của người dùng khác gây ảnh hưởng đến bạn — chúng tôi sẽ xử lý khi nhận được báo cáo.",
            "Thiệt hại gián tiếp phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, ngoài phạm vi phí dịch vụ đã thanh toán.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cine-warn flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "thay-doi-dk",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "7. Thay đổi điều khoản",
    summary:
      "CineWrap thông báo trước ít nhất 30 ngày mỗi khi cập nhật điều khoản.",
    content: (
      <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
        <div className="flex flex-col md:flex-row gap-4">
          {[
            {
              step: "01",
              title: "Soạn thảo cập nhật",
              desc: "Đội pháp lý soạn thảo và rà soát nội dung thay đổi.",
              color: "text-cine-secondary",
              border: "border-cine-secondary/30",
            },
            {
              step: "02",
              title: "Thông báo 30 ngày",
              desc: "Gửi email tóm tắt thay đổi đến toàn bộ tài khoản đang hoạt động.",
              color: "text-cine-primary",
              border: "border-cine-primary/30",
            },
            {
              step: "03",
              title: "Hiệu lực",
              desc: "Điều khoản mới có hiệu lực. Tiếp tục sử dụng đồng nghĩa với chấp thuận.",
              color: "text-emerald-400",
              border: "border-emerald-500/30",
            },
          ].map((step) => (
            <div
              key={step.step}
              className={`flex-1 p-4 rounded-xl border ${step.border} bg-cine-bg-primary/40`}
            >
              <p className={`text-2xl font-extrabold ${step.color} mb-2`}>
                {step.step}
              </p>
              <p className="text-cine-text font-semibold text-xs mb-1">
                {step.title}
              </p>
              <p className="text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs">
          Nếu bạn không đồng ý với điều khoản mới, bạn có quyền huỷ tài khoản
          trước ngày hiệu lực và được hoàn tiền phần dịch vụ chưa sử dụng theo
          tỷ lệ.
        </p>
      </div>
    ),
  },
  {
    id: "phap-luat",
    icon: (
      <svg
        className="w-5 h-5"
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
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "8. Pháp luật áp dụng & Giải quyết tranh chấp",
    summary:
      "Tuân theo pháp luật Việt Nam, ưu tiên hoà giải trước khi khởi kiện.",
    content: (
      <div className="space-y-4 text-sm text-cine-text-muted leading-relaxed">
        <p>
          Điều khoản này được điều chỉnh bởi pháp luật Cộng hoà Xã hội Chủ nghĩa
          Việt Nam. Mọi tranh chấp phát sinh sẽ được xử lý theo trình tự:
        </p>
        <ol className="space-y-3">
          {[
            {
              num: "1.",
              title: "Liên hệ trực tiếp",
              desc: "Gửi yêu cầu tới legal@cinewrap.vn — chúng tôi cam kết phản hồi trong 5 ngày làm việc.",
            },
            {
              num: "2.",
              title: "Hoà giải",
              desc: "Nếu không giải quyết được qua thư, hai bên đồng ý tiến hành hoà giải tại Trung tâm Hoà giải Thương mại Việt Nam (VMC).",
            },
            {
              num: "3.",
              title: "Toà án",
              desc: "Trường hợp hoà giải thất bại, tranh chấp được đưa ra Toà án nhân dân có thẩm quyền tại TP. Hồ Chí Minh.",
            },
          ].map((step) => (
            <li key={step.num} className="flex gap-3">
              <span className="text-cine-primary font-extrabold flex-shrink-0">
                {step.num}
              </span>
              <span>
                <span className="text-cine-text font-semibold">
                  {step.title}:{" "}
                </span>
                {step.desc}
              </span>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
];
