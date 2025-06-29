# AK Task Tracking

Ứng dụng ReactJS với TypeScript để tracking task theo tuần, tích hợp với Taiga project management platform.

## Tính năng chính

### 📊 Dashboard

- Thống kê tổng quan về tasks
- Hiển thị số lượng task theo trạng thái
- Tỷ lệ hoàn thành và phân bố trạng thái
- Theo dõi giờ ước tính vs thực tế

### 📅 Tracking theo tuần

- Xem tasks theo từng tuần
- Điều hướng giữa các tuần dễ dàng
- Hiển thị tiến độ hoàn thành của từng tuần
- Thống kê chi tiết cho mỗi tuần

### 🎯 Quản lý Task

- Thêm task mới với đầy đủ thông tin
- Chỉnh sửa thông tin task
- Xóa task
- Phân loại theo trạng thái và độ ưu tiên
- Gán tags cho task

### 🎨 Giao diện

- Sử dụng Material-UI (MUI) cho giao diện đẹp và hiện đại
- Responsive design cho mobile và desktop
- Dark/Light theme support
- Animations mượt mà

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 8.0.0

### Cài đặt dependencies

```bash
npm install
```

### Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

### Build production

```bash
npm run build
```

## Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Dashboard tổng quan
│   ├── WeekNavigation.tsx # Điều hướng tuần
│   ├── WeekView.tsx     # Hiển thị tasks theo tuần
│   ├── TaskCard.tsx     # Card hiển thị task
│   └── TaskForm.tsx     # Form thêm/sửa task
├── types/               # TypeScript type definitions
│   └── Task.ts         # Task interfaces và enums
├── services/            # API services
│   └── TaigaService.ts # Service tương tác với Taiga
├── utils/               # Utility functions
│   └── dateUtils.ts    # Xử lý ngày tháng
└── App.tsx             # Component chính
```

## Tích hợp với Taiga

### Cấu hình API

Để kết nối với Taiga, cần cấu hình trong `src/services/TaigaService.ts`:

```typescript
const taigaConfig: TaigaConfig = {
  baseUrl: "https://konytaiga.madp.tm.softbank.jp",
  token: "your-api-token", // Optional
};
```

### API Endpoints

- `GET /api/v1/projects` - Lấy danh sách projects
- `GET /api/v1/tasks` - Lấy danh sách tasks
- `POST /api/v1/tasks` - Tạo task mới
- `PATCH /api/v1/tasks/{id}` - Cập nhật task

## Sử dụng

### 1. Xem Dashboard

- Mở ứng dụng, dashboard sẽ hiển thị thống kê tổng quan
- Xem số lượng task theo trạng thái
- Kiểm tra tỷ lệ hoàn thành

### 2. Điều hướng tuần

- Sử dụng nút mũi tên để chuyển tuần
- Nút "Hôm nay" để quay về tuần hiện tại
- Xem thống kê chi tiết của từng tuần

### 3. Quản lý Task

- Click nút "+" để thêm task mới
- Click icon edit trên task card để chỉnh sửa
- Click icon delete để xóa task

### 4. Thông tin Task

Mỗi task bao gồm:

- **Tiêu đề**: Tên task
- **Mô tả**: Chi tiết về task
- **Trạng thái**: New, In progress, Ready for test, Testing, Done, Closed
- **Độ ưu tiên**: Low, Normal, High, Critical
- **Người được phân công**: Tên người thực hiện
- **Dự án**: Tên dự án
- **Tags**: Nhãn phân loại
- **Giờ ước tính/Thực tế**: Thời gian làm việc
- **Ngày tạo/Hoàn thành/Hạn**: Các mốc thời gian

## Công nghệ sử dụng

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI components
- **date-fns** - Xử lý ngày tháng
- **axios** - HTTP client
- **Vite** - Build tool

## Phát triển

### Thêm tính năng mới

1. Tạo component mới trong `src/components/`
2. Định nghĩa types trong `src/types/`
3. Thêm logic xử lý trong `src/services/` nếu cần
4. Cập nhật `App.tsx` để tích hợp

### Cấu trúc Task

```typescript
interface Task {
  id: number;
  subject: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_date: string;
  finished_date?: string;
  due_date?: string;
  assigned_to?: string;
  project: string;
  tags: string[];
  estimated_hours?: number;
  actual_hours?: number;
}
```

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.

## Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.
