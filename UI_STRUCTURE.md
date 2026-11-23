# CẤU TRÚC GIAO DIỆN — STUDENT P2P

Tài liệu này mô tả chi tiết kiến trúc giao diện (UI/UX Architecture), hệ thống thiết kế (Design System), sơ đồ phân cấp component và bố cục từng trang của nền tảng **Student P2P**.

---

## 1. Hệ thống thiết kế (Design System)

### 1.1. Bảng màu (Color System)
Hỗ trợ đồng thời **Light Mode** và **Dark Mode** (`class="dark"` trên `<html>`):

| Vai trò | Light Mode | Dark Mode | Mục đích sử dụng |
|---|---|---|---|
| **Primary** | `#4F46E5` (`indigo-600`) | `#6366F1` (`indigo-500`) | CTA chính, liên kết active, giá sản phẩm |
| **Secondary / Accent** | `#0EA5E9` (`sky-500`) | `#38BDF8` (`sky-400`) | Gradient thương hiệu, icon điểm nhấn |
| **Background** | `#F8FAFC` (`slate-50`) | `#020617` (`slate-950`) | Nền tổng thể toàn trang |
| **Surface / Card** | `#FFFFFF` (`white`) | `#0F172A` (`slate-900`) | Card, Modal, Navbar, Sidebar |
| **Text Primary** | `#0F172A` (`slate-900`) | `#F8FAFC` (`slate-100`) | Tiêu đề, nội dung chính |
| **Text Muted** | `#64748B` (`slate-500`) | `#94A3B8` (`slate-400`) | Mô tả phụ, timestamp, metadata |
| **Border** | `#E2E8F0` (`slate-200`) | `#1E293B` (`slate-800`) | Viền card, divider, input |
| **Success** | `#10B981` (`emerald-500`) | `#34D399` (`emerald-400`) | Xác thực sinh viên, miễn phí, thành công |
| **Warning** | `#F59E0B` (`amber-500`) | `#FBBF24` (`amber-400`) | Đánh giá sao, trao đổi, cảnh báo |
| **Error** | `#E11D48` (`rose-600`) | `#FB7185` (`rose-400`) | Lỗi validation, thông báo chưa đọc |

### 1.2. Typography
- **Display / Headings**: `Plus Jakarta Sans` (`600`, `700`, `800`)
- **Body / UI**: `Inter` (`400`, `500`, `600`, `700`)

### 1.3. Hình khối & Chuyển động
- **Border Radius**: `rounded-xl` (12px) cho input/button, `rounded-2xl` (16px) cho card/modal, `rounded-full` cho badge/avatar.
- **Aspect Ratio**: `aspect-[4/3]` kết hợp `object-cover` cho toàn bộ ảnh listing để không bị méo khung hình.
- **Animations**: `animate-fade-in` (0.22s), `animate-slide-up` (0.28s), card hover nâng nhẹ `-translate-y-0.5`.

---

## 2. Cấu trúc Responsive Breakpoints

| Breakpoint | Thiết bị mục tiêu | Bố cục chính |
|---|---|---|
| `320px – 425px` | Mobile (iPhone SE, Android) | 1 cột listing, Top Header rút gọn + **Mobile Bottom Navigation Bar** (5 tab) + Drawer Menu |
| `640px – 768px` | Tablet nhỏ / Phablet | 2 cột listing, form 2 cột cho các trường ngắn |
| `1024px+` | Laptop / Desktop | 3–4 cột listing, Sidebar bộ lọc cố định bên trái, Live Preview khi đăng bài, Split-pane Chat |
| `1280px – 1440px+` | Màn hình lớn | Container giới hạn `max-w-7xl` (1280px) căn giữa với khoảng trắng hợp lý |

---

## 3. Cây phân cấp Component (`src/components/`)

```text
src/components/
├── ui/                          # Design System Primitives (Tái sử dụng toàn app)
│   ├── Avatar.tsx               # Ảnh đại diện + fallback initials + badge xác thực
│   ├── Badge.tsx                # Nhãn trạng thái (default, primary, success, warning, danger)
│   ├── Button.tsx               # Nút bấm (5 variants, 3 sizes, loading state)
│   ├── Card.tsx                 # Khung nội dung bo góc, hỗ trợ hoverable
│   ├── CategoryIcon.tsx         # Map icon Lucide đồng nhất theo danh mục
│   ├── Dropdown.tsx             # Menu thả xuống đóng khi click ngoài / nhấn Esc
│   ├── Input.tsx                # Input, Textarea, Select kèm label, error, hint
│   ├── Loading.tsx              # LoadingSpinner, ListingCardSkeleton, ListingGridSkeleton
│   ├── Modal.tsx                # Hộp thoại có backdrop blur & Esc close
│   ├── Pagination.tsx           # Phân trang có trạng thái active & disabled
│   ├── StateViews.tsx           # EmptyState & ErrorState chuẩn hóa
│   └── Tabs.tsx                 # Thanh chuyển tab có badge đếm số lượng
│
├── layout/                      # Khung sườn ứng dụng
│   ├── Logo.tsx                 # Logo SVG Student P2P (concept kết nối P2P)
│   ├── Navbar.tsx               # Header desktop + Mobile Drawer + Bottom Navigation Bar
│   ├── Footer.tsx               # Footer đa cột giới thiệu & điều hướng nhanh
│   └── MainLayout.tsx           # Wrapper: Navbar -> Main -> Footer
│
└── listings/                    # Component nghiệp vụ bài đăng
    ├── FilterPanel.tsx          # Bộ lọc nâng cao (danh mục, loại, tình trạng, giá, khu vực, thời gian, sắp xếp)
    ├── ListingCard.tsx          # Card bài đăng chuẩn (ảnh 4:3, giá, tình trạng, lưu bài, liên hệ nhanh)
    └── SearchBar.tsx            # Thanh tìm kiếm nhanh có nút xóa & submit
```

---

## 4. Kiến trúc các Trang (`src/pages/`)

1. **`/` — `HomePage` (Trang chủ)**
   - **Hero Section**: Định vị rõ "Student P2P là gì" + SearchBar lớn + CTA (`Khám phá bài đăng`, `Đăng bài miễn phí`).
   - **Danh mục phổ biến**: Lưới 12 danh mục sinh viên.
   - **Bài đăng nổi bật**: 4 listing được quan tâm nhất.
   - **Bài đăng mới nhất**: 8 listing cập nhật gần đây.
   - **Quy trình 3 bước & CTA Banner**: Hướng dẫn sử dụng và kêu gọi đăng bài.

2. **`/explore` — `ExplorePage` (Khám phá & Tìm kiếm)**
   - Thanh `SearchBar` + Nút bật bộ lọc trên mobile.
   - Bố cục 2 phần: `FilterPanel` (trái, 3/12 cột) + Lưới kết quả & `Pagination` (phải, 9/12 cột).
   - Đầy đủ Skeleton Loading, EmptyState (khi không có kết quả) và ErrorState (kèm nút thử lại).

3. **`/categories` — `CategoriesPage` (Hệ thống danh mục)**
   - Lưới 12 card danh mục kèm mô tả và số lượng bài đăng thực tế.

4. **`/listing/:id` — `ListingDetailPage` (Chi tiết bài đăng)**
   - Breadcrumb điều hướng.
   - Cột trái: Gallery ảnh (ảnh chính + thumbnail) + Mô tả chi tiết + Tags.
   - Cột phải: Badge danh mục/tình trạng, Giá, Địa điểm, Thời gian, Nút `Nhắn tin trực tiếp`, `Thông tin liên hệ`, `Lưu`, `Chia sẻ`, Card thông tin người bán & Lưu ý an toàn.
   - Phía dưới: Khu vực **Tin đăng tương tự**.

5. **`/create` — `CreateListingPage` (Đăng bài mới)**
   - Cột trái: Form 3 bước có validation chặt chẽ (Thông tin cơ bản, Mô tả & Upload/URL ảnh, Địa điểm & Liên hệ).
   - Cột phải: **Live Preview** cập nhật theo thời gian thực khi người dùng nhập liệu (trên mobile có nút chuyển đổi xem trước).

6. **`/messages` — `MessagesPage` (Tin nhắn P2P)**
   - Giao diện Split-pane hiện đại:
     - Cột trái: Danh sách cuộc trò chuyện + số tin nhắn chưa đọc.
     - Cột phải: Khung chat (Header thông tin đối tác + bài đăng đính kèm, bong bóng chat, thời gian, trạng thái `Đã xem`/`Đã gửi`, khung nhập gửi tin nhắn).
   - Trên mobile tự động chuyển đổi giữa màn hình danh sách và màn hình chat có nút quay lại.

7. **`/notifications` — `NotificationsPage` (Thông báo)**
   - Tab lọc `Tất cả` / `Chưa đọc`, nút `Đánh dấu tất cả đã đọc`, danh sách thông báo phân loại theo icon.

8. **`/saved` — `SavedPage` (Bài đăng đã lưu)**
   - Danh sách các bài đăng đã đánh dấu yêu thích hoặc EmptyState hướng dẫn quay lại trang Khám phá.

9. **`/profile` — `ProfilePage` (Hồ sơ người dùng)**
   - Header thông tin sinh viên (Avatar, Verified badge, Trường, Ngành, Điểm đánh giá).
   - Modal `Chỉnh sửa hồ sơ`.
   - 3 Tabs: `Bài đăng của tôi` (quản lý Đã bán / Mở bán lại / Xóa), `Đánh giá`, `Hoạt động`.

10. **`/auth` — `AuthPage` (Đăng nhập / Đăng ký / Quên mật khẩu)**
    - Chuyển đổi mượt giữa 3 chế độ, ẩn/hiện mật khẩu, ghi nhớ đăng nhập, và nút **Đăng nhập nhanh (Demo)** để trải nghiệm ngay.
