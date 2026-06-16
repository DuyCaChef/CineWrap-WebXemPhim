import React from "react";

// ---------------------------SECTION 1: GENERAL---------------------------
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

// ---------------------------SECTION 2: PRIVACY---------------------------
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
