# CineWrap Frontend — Thư mục và Cấu trúc

Tài liệu này mô tả cấu trúc chính của thư mục `cinewrap-fontend` và giải thích vị trí các file/thư mục quan trọng để phát triển, chạy và deploy ứng dụng frontend.

Mục tiêu: giúp developer mới nhanh chóng nắm được cấu trúc dự án và nơi cần sửa khi làm việc trên giao diện.

---

Root files

- `package.json`: phụ thuộc, scripts (dev/build/start).
- `vite.config.ts`: cấu hình Vite cho dự án.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: cấu hình TypeScript.
- `index.html`: entry HTML cho ứng dụng.

Thư mục `public/`

- Chứa tài nguyên tĩnh (favicon, manifest, assets public).

Thư mục `src/`

- `main.tsx`: entry point của React app (mount root).
- `index.css`, `App.css`: styles toàn cục và styles App.
- `App.tsx`: component App chính, routing cao cấp nếu có.
- `assets/`: ảnh, icons và tài sản (images/ nằm trong đó).
- `components/`: các component dùng chung.
  - `Header.tsx`, `Footer.tsx`, `TypewriterText.tsx` — component UI chung.
  - `landing/`: các section của trang landing (Hero, Privacy, Terms, Support,...)
- `pages/`: các trang độc lập, ví dụ `WelcomePage.tsx`.
- `constants/`: hằng số hoặc dữ liệu tĩnh như `landingData.tsx`.

Testing & Linting

- ESLint cấu hình trong `eslint.config.js`.

Chạy & Phát triển

- Cài phụ thuộc:

```
npm install
```

- Chạy dev server (Vite):

```
npm run dev
```

- Build cho production:

```
npm run build
```

Ghi chú cho developer

- Khi thêm ảnh tĩnh cho UI landing, đặt vào `src/assets/images/` và import từ component.
- Thêm component tái sử dụng vào `src/components/`.
- Các nội dung landing tĩnh được lưu ở `src/constants/landingData.tsx` để dễ chỉnh sửa/phiên dịch.

---

Nếu bạn muốn, tôi có thể thêm phần hướng dẫn deploy (Netlify/Vercel) hoặc ví dụ cấu hình `env` và scripts NPM.

---

Cấu trúc thư mục (tree) — với chú thích ngắn (không liệt kê file chi tiết)

```
cinewrap-fontend/                # Root frontend project
├─ package.json                  # npm scripts & dependencies
├─ vite.config.ts                # Vite build/dev config
├─ tsconfig*.json                # TypeScript configs
├─ index.html                    # HTML entry
├─ public/                       # Static public assets (favicon, manifest,...)
└─ src/                          # Source code
	├─ main.tsx                   # App bootstrap / mount
	├─ App.tsx                    # Root App component / routing
	├─ assets/                    # Images, fonts, other static assets used by components
	├─ components/                # Reusable UI components (Header, Footer, shared widgets)
	├─ components/landing/        # Sections & components specific to landing page
	├─ pages/                     # Page-level components (one per route)
	├─ constants/                 # Static data, configs, copy for pages
	└─ styles/ (or index.css, App.css) # Global and component styles
```
