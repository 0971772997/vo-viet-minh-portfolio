# Võ Viết Minh Portfolio

Portfolio cá nhân chuyên nghiệp xây dựng bằng **Next.js 15 (App Router)**, **TypeScript**, **Framer Motion**, giao diện Dark Premium phong cách hiện đại.

---

## 1. Cài đặt & Khởi chạy dự án

```bash
# Cài đặt dependencies
npm install

# Khởi chạy môi trường phát triển (http://localhost:3000)
npm run dev

# Kiểm tra tính toàn vẹn của mã nguồn
npm run typecheck
npm run lint
npm run build
```

---

## 2. Hướng dẫn cấu hình Cơ sở dữ liệu Supabase

Hệ thống sử dụng Supabase PostgreSQL và Supabase Storage thông qua REST API (không phụ thuộc SDK nặng). Khi chưa cấu hình DB hoặc bảng rỗng, website sẽ **tự động fallback về dữ liệu tĩnh** trong `src/data/site.ts`.

### Bước 2.1: Chạy SQL Schema trên Supabase
1. Đăng nhập vào [supabase.com](https://supabase.com) và vào Project của bạn.
2. Mở mục **SQL Editor** ở thanh menu bên trái.
3. Dán toàn bộ nội dung trong file `supabase.sql` vào và nhấn **Run**.
   > *Lưu ý*: Script `supabase.sql` được viết dưới dạng **idempotent** (`create table if not exists`, `alter table ... add column if not exists`), nên bạn có thể chạy lại bất cứ lúc nào trên database đã có dữ liệu mà **không bị mất dữ liệu cũ**.

### Bước 2.2: Tạo Bucket Lưu Trữ Ảnh (Storage)
1. Vào **Storage** > **New bucket**.
2. Đặt tên bucket là: `portfolio`.
3. Bật tùy chọn **Public bucket** (để ảnh có thể hiển thị trực tiếp trên website).
4. Nhấn **Save**.

### Bước 2.3: Thiết lập biến môi trường (`.env.local`)
Tạo file `.env.local` tại thư mục gốc với các biến:

```env
ADMIN_PASSWORD=MatKhauAdminCuaBan123
ADMIN_SECRET=ChuoiNgauNhienDaiDeKyHmacCookieBaoMat987654321
SUPABASE_URL=https://your-project-ref.supabase.co
# QUAN TRỌNG: Dùng key 'service_role' (Project Settings > API > Project API keys > service_role), KHÔNG dùng publishable/anon key vì bảng đã bật RLS.
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 3. Hướng dẫn sử dụng Bảng điều khiển Quản trị (`/admin`)

Truy cập đường dẫn: `http://localhost:3000/admin` và nhập `ADMIN_PASSWORD` đã cấu hình.

Giao diện quản trị được chia làm 3 Tab chính:

### 3.1 Tab "Dự án"
- **Nhập dữ liệu mẫu**: Nếu bảng dự án trong DB đang trống, bấm nút *"Nhập dữ liệu mẫu vào DB"* để nhập nhanh các dự án mẫu từ `site.ts`.
- **Thêm / Sửa dự án**:
  - Nhập tên, slug, tóm tắt, vai trò, công nghệ (ngăn cách bằng dấu phẩy), tính năng nổi bật (mỗi dòng một mục).
  - Điền link **GitHub** và **Live Demo** chính.
  - **Ảnh bìa**: Tải lên 1 ảnh đại diện cho dự án (tỷ lệ 16:9).
  - **Thư viện ảnh demo**: Tải lên nhiều ảnh minh họa (tối đa 12 ảnh), có xem trước và xóa từng ảnh.
  - **Liên kết bổ sung**: Bấm *"+ Thêm liên kết"* để thêm nhiều link khác ngoài Live Demo (ví dụ: *"Video demo"*, *"Figma"*, *"Swagger API"*, *"Bản mobile"*...). Mỗi dòng gồm Nhãn + URL (bắt đầu bằng `http://` hoặc `https://`).
- **Danh sách dự án**: Bấm *Sửa* để nạp dữ liệu lên form, hoặc *Xóa* (có hộp thoại xác nhận).

### 3.2 Tab "Kinh nghiệm"
- **Nhập dữ liệu mẫu**: Bấm *"Nhập kinh nghiệm mẫu vào DB"* để đưa dòng thời gian kinh nghiệm và học vấn hiện có vào database (không bị trùng lặp).
- **Thêm / Sửa mốc thời gian**:
  - Nhập thời gian (ví dụ: `03/2026 – nay`), đơn vị/trường học, vai trò.
  - Nhập chi tiết công việc/thành tích (mỗi dòng một gạch đầu dòng).
  - Tải lên nhiều ảnh minh họa/kết quả thực tế (tối đa 12 ảnh).
  - Thêm các liên kết tài liệu/website chứng minh đính kèm.
- **Sắp xếp thứ tự**: Dùng các nút **⬆️ Lên** / **⬇️ Xuống** trên từng thẻ kinh nghiệm để thay đổi vị trí xuất hiện trên trang chủ tức thì.

### 3.3 Tab "Chứng nhận"
- **Nhập dữ liệu mẫu**: Bấm *"Nhập chứng nhận mẫu vào DB"* để đưa giấy chứng nhận *"Thành viên đạt KPI xanh"* của AZ Media vào DB.
- **Thêm / Sửa chứng nhận**:
  - Nhập tên chứng nhận, đơn vị cấp, ngày cấp (`dd/mm/yyyy`), mô tả nội dung.
  - Tải lên ảnh giấy chứng nhận bản gốc rõ nét.
  - Nhập **Link xác thực trực tuyến** (nếu có chứng chỉ online để người xem bấm kiểm tra).
- **Sắp xếp thứ tự**: Sử dụng nút mũi tên **⬆️ Lên** / **⬇️ Xuống** để thay đổi vị trí ưu tiên.

---

## 4. Trải nghiệm người dùng trên Trang chủ

- **Phóng to ảnh (Lightbox)**: Bấm vào bất kỳ ảnh dự án, ảnh demo kinh nghiệm, hoặc giấy chứng nhận để mở popup phóng to toàn màn hình sắc nét. Hỗ trợ phím `Esc` hoặc bấm ra ngoài để đóng.
- **Tối ưu hiệu năng**: Tích hợp lazy loading cho ảnh và hỗ trợ `prefers-reduced-motion` cho người dùng nhạy cảm với chuyển động.
- **Responsive**: Tương thích hoàn hảo từ màn hình điện thoại 360px đến desktop 1920px.
