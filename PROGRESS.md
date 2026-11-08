# TIẾN ĐỘ DỰ ÁN (PROGRESS)

## 1. Đã hoàn thành (Phiên bản Nâng cấp Admin & Tối ưu Trải nghiệm)

### Cơ sở dữ liệu & Xử lý RLS Storage/Database
- **Bổ sung toàn bộ RLS Policies cho Supabase (`supabase.sql`)**:
  - Tự động tạo và cấu hình bucket `portfolio` (Public bucket).
  - Thêm đầy đủ chính sách `storage.objects` (SELECT, INSERT, UPDATE, DELETE) cho bucket `portfolio`.
  - Thêm chính sách RLS cho các bảng `projects`, `experiences`, `certificates`, khắc phục triệt để lỗi `403 new row violates row-level security policy` khi dùng bất kỳ loại key nào từ Supabase.
- **Tối ưu cơ chế Upsert & Lưu thông minh (`projects/route.ts`)**:
  - Hỗ trợ `resolution=merge-duplicates` theo `slug` và cập nhật theo `id`. Cho phép người dùng chỉnh sửa ngay các dự án mẫu (kể cả khi chưa có ID trong DB) và lưu đè/chèn mới thành công ngay lập tức.
- **Cập nhật dữ liệu thật Công ty Maxping Media (`src/data/site.ts`)**:
  - GitHub: `https://github.com/0971772997/Cong-ty-MAXPING-Media`
  - Live Demo: `http://maxping-media.duckdns.org/`

### Nâng cấp Hiệu ứng động Đẹp mắt (Visual & Motion)
- **Hero & Branding**:
  - Hiệu ứng text gradient đa sắc chạy lướt (shimmer flow) sống động hơn.
  - Chấm trạng thái sẵn sàng kết nối `.dot` có hiệu ứng sóng lan tỏa (`ping pulse animation`).
  - Nút `.btn.primary`: hiệu ứng gradient trượt (`gradientSlide`) và dải sáng quét qua (`shimmer sweep`) khi di chuột.
  - Các chip kỹ năng quanh avatar: hiệu ứng bồng bềnh 3D và scale phát sáng neon khi hover.
- **Card & Dự án**:
  - Hiệu ứng ánh sáng quét qua ảnh bìa dự án (`.pimg-wrap::after`) khi rê chuột.
  - Thẻ dự án: hover nhấc lên mượt mà với Framer Motion và bóng đổ neon tím-cyan (`box-shadow: 0 16px 40px rgba(103, 232, 249, 0.1)`).
- **Dòng thời gian Timeline**:
  - Các nút mốc thời gian `.tl li::before` có hiệu ứng nhịp thở phát sáng (`dotPulse 3s ease-in-out infinite`).
  - Trục dòng thời gian có gradient chuyển tiếp đa sắc từ tím sang xanh dương và cyan.
- **Modal Chi tiết & Lightbox**:
  - Chuyển động mở mượt mà với Framer Motion Spring (`damping: 25, stiffness: 320`).
- **Giao diện Admin**:
  - Highlight viền sáng neon cho form khi ở chế độ chỉnh sửa (`.editing-mode`).
  - Trợ giúp nhanh ngay trên giao diện về quyền RLS của Supabase.
- **Idempotent Supabase Schema (`supabase.sql`)**:
  - Bảng `projects`: thêm `links jsonb` (danh sách nhãn + URL), `images text[]` (nhiều ảnh phụ ngoài ảnh bìa).
  - Bảng `experiences`: chuyển timeline từ tĩnh sang DB (`id`, `period`, `place`, `role`, `points text[]`, `images text[]`, `links jsonb`, `sort`, `created_at`).
  - Bảng `certificates`: chuyển chứng nhận sang DB (`id`, `title`, `issuer`, `date`, `description`, `image`, `link`, `sort`, `created_at`).
  - Toàn bộ bảng bật RLS, chỉ cho phép server qua `service_role key`.
- **Thư viện DB (`src/lib/db.ts`)**:
  - Bổ sung `getExperiences()` và `getCertificates()`.
  - Fallback thông minh về dữ liệu tĩnh (`src/data/site.ts`) khi chưa cấu hình DB hoặc bảng rỗng.
- **Validation an toàn phía Server (`src/lib/admin-validate.ts`)**:
  - Kiểm tra UUID, xác thực URL `http(s)`, cắt khoảng trắng `trim()`, giới hạn độ dài, giới hạn tối đa 12 ảnh và 8 liên kết mỗi mục.
- **Mở rộng API Admin**:
  - `POST /api/admin/upload`: hỗ trợ tham số thư mục `folder` (`projects`, `experiences`, `certificates`), validate MIME `png|jpg|webp|gif` <= 5MB, đặt tên UUID.
  - `GET, POST, PUT, DELETE /api/admin/projects`: quản lý dự án, seed dữ liệu mẫu không trùng lặp, cập nhật `images` và `links`.
  - `GET, POST, PUT, DELETE /api/admin/experiences`: quản lý kinh nghiệm, sắp xếp thứ tự `sort` (nút lên/xuống), seed timeline mẫu không trùng.
  - `GET, POST, PUT, DELETE /api/admin/certificates`: quản lý chứng nhận, sắp xếp thứ tự, upload ảnh, link xác thực online, seed chứng chỉ KPI xanh.
  - Mọi route đều bảo vệ qua `isAdmin()` và `dbReady`.

### Giao diện Admin (`src/app/admin/page.tsx`)
- Phân chia 3 Tab rõ ràng: **Dự án** | **Kinh nghiệm** | **Chứng nhận**.
- Mỗi tab gồm form thêm/sửa phía trên và danh sách quản lý bên dưới, xác nhận khi xóa (`confirm`), thông báo kết quả thao tác trực quan.
- Component dùng chung:
  - `MultiImageUploader`: upload nhiều ảnh xem trước dạng lưới, xóa từng ảnh, hiển thị trạng thái đang upload.
  - `SingleImageUploader`: upload ảnh bìa / ảnh chứng nhận, xem trước, thay thế hoặc gỡ ảnh.
  - `LinkListEditor`: thêm/xóa từng dòng link (nhãn + URL http/https), có gợi ý nhanh (Video demo, Figma, Swagger API, Bản mobile...).
  - Điều khiển vị trí (Reorder): nút ⬆️ Lên / ⬇️ Xuống cho phép thay đổi thứ tự trực tiếp.
- Khả năng tiếp cận: hỗ trợ phím bấm, focus rõ ràng, responsive từ 360px đến 1920px.

### Giao diện hiển thị người dùng (`src/components/Sections.tsx`, `src/app/page.tsx`)
- Server Component (`src/app/page.tsx`) gọi song song `getProjects()`, `getExperiences()`, `getCertificates()`.
- **Dự án**:
  - Thẻ dự án: hiển thị ảnh bìa, tóm tắt, tag công nghệ, huy hiệu số lượng demo/tài liệu bổ sung.
  - Modal chi tiết: hiển thị thư viện ảnh bổ sung, mở rộng đầy đủ các link demo (Video demo, Figma, Swagger, Mobile...) với `target="_blank" rel="noreferrer"`. Bấm vào bất kỳ ảnh nào để phóng to.
- **Kinh nghiệm & Học vấn**:
  - Hiển thị mốc thời gian, đơn vị, vai trò, các điểm thành tích.
  - Hiển thị ảnh demo/bằng chứng dưới dạng lưới nhỏ, có lazy loading và alt text đầy đủ.
  - Hiển thị danh sách liên kết demo/tài liệu đính kèm.
- **Chứng nhận**:
  - Dạng lưới thẻ kèm ảnh; bấm ảnh để phóng to xem bản gốc chi tiết.
  - Nút "Xác thực trực tuyến" nếu có link chứng chỉ.
- **Lightbox (`src/components/Lightbox.tsx`)**:
  - Xem ảnh phóng to toàn màn hình mượt mà bằng Framer Motion, hỗ trợ phím Esc để đóng, đóng khi bấm ra ngoài nền, nút mở ảnh gốc trong tab mới.
  - Tôn trọng `prefers-reduced-motion`.

---

## 2. Các file đã tạo / chỉnh sửa

| Tệp tin | Trạng thái | Nội dung chính |
|---|---|---|
| `supabase.sql` | Cập nhật | Schema idempotent cho bảng `projects`, `experiences`, `certificates`, RLS |
| `src/data/site.ts` | Cập nhật | Bổ sung type `CustomLink`, `ExperienceItem`, `CertificateItem`, mở rộng `Project` |
| `src/lib/db.ts` | Cập nhật | Thêm hàm `getExperiences()`, `getCertificates()`, fallback dữ liệu tĩnh |
| `src/lib/admin-validate.ts` | Tạo mới | Helper validate UUID, URL, images (<=12), links (<=8), text sanitize |
| `src/components/admin/SingleImageUploader.tsx` | Tạo mới | Component chọn/tải 1 ảnh kèm preview |
| `src/components/admin/MultiImageUploader.tsx` | Tạo mới | Component tải nhiều ảnh kèm lưới preview, xóa từng ảnh |
| `src/components/admin/LinkListEditor.tsx` | Tạo mới | Component thêm/xóa từng dòng link (nhãn + URL http/https) |
| `src/components/Lightbox.tsx` | Tạo mới | Modal phóng to xem ảnh lớn toàn màn hình |
| `src/app/admin/page.tsx` | Cập nhật | Giao diện 3 tab quản trị (Dự án, Kinh nghiệm, Chứng nhận), reorder, seed |
| `src/app/api/admin/upload/route.ts` | Cập nhật | Nhận tham số `folder`, validate ảnh <= 5MB |
| `src/app/api/admin/projects/route.ts` | Cập nhật | Hỗ trợ `images`, `links`, validation, seed không trùng |
| `src/app/api/admin/experiences/route.ts` | Tạo mới | CRUD kinh nghiệm, sắp xếp `sort`, seed không trùng |
| `src/app/api/admin/certificates/route.ts` | Tạo mới | CRUD chứng nhận, sắp xếp `sort`, link xác thực, seed không trùng |
| `src/components/Sections.tsx` | Cập nhật | Thư viện ảnh dự án, lưới ảnh timeline, phóng to ảnh, link ngoài |
| `src/app/page.tsx` | Cập nhật | Truyền props từ DB vào Projects, Experience, Certificates |
| `src/app/globals.css` | Cập nhật | Styling admin tabs, uploaders, links editor, badges, lightbox, responsive |
| `README.md` | Cập nhật | Hướng dẫn chạy lại SQL, hướng dẫn sử dụng 3 tab admin |

---

## 3. Phần còn thiếu / Đề xuất nâng cấp tiếp theo
- Kết nối dịch vụ gửi email liên hệ (Resend / SendGrid) thay vì mở `mailto:`.
- Thêm trang chi tiết dự án độc lập (Static/Dynamic route `/projects/[slug]`) phục vụ SEO nếu cần.
- Bổ sung tính năng phân trang (pagination) trong admin khi số lượng bản ghi lớn (> 50 mục).
