# AK Task Tracking - KonyTaiga Integration

Ứng dụng ReactJS với TypeScript để tracking task theo tuần và thống kê theo năm, tích hợp với KonyTaiga project management platform.

## 🚀 Tính năng chính

### 📊 Dashboard Tổng Quan

- **Thống kê tổng quan**: Hiển thị số lượng task theo trạng thái (DONE, MR, In Progress & Incoming)
- **Tỷ lệ hoàn thành**: Progress bar và phần trăm hoàn thành
- **Giờ ước tính vs thực tế**: So sánh thời gian dự kiến và thực tế
- **Phân bố trạng thái**: Chip hiển thị số lượng task theo từng trạng thái

### 📅 Tracking Theo Tuần

- **Điều hướng tuần**: Nút Previous/Next và "Hôm nay" để chuyển đổi tuần
- **Thống kê tuần**: Hiển thị chi tiết tasks trong tuần được chọn
- **Phân loại trạng thái**: Gộp "incoming" và "inprogress" thành "In Progress & Incoming"

### 📈 Thống Kê Theo Năm

- **Chart theo tháng**: Stacked bar chart hiển thị task đã hoàn thành theo 12 tháng
- **Dropdown chọn năm**: Chuyển đổi giữa các năm để so sánh hiệu suất
- **Độc lập với tracking tuần**: Không bị ảnh hưởng bởi việc chọn tuần

### 👥 Thống Kê Team

- **Avatar và tên**: Hiển thị thông tin từng member với avatar
- **Số lượng task theo trạng thái**: Màu sắc tương ứng với dashboard
- **Responsive layout**: Hiển thị tốt trên mobile và desktop

### 🔐 Quản Lý Đăng Nhập

- **Tự động đăng nhập**: Lưu thông tin user vào localStorage
- **Hiển thị thông tin user**: Avatar và tên user thực tế trên navbar
- **Session persistence**: Tự động khôi phục session khi refresh

## 🛠️ Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 8.0.0

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình Environment Variables

Tạo file `.env` trong thư mục gốc:

```env
# Taiga Configuration
VITE_TAIGA_BASE_URL=https://konytaiga.madp.tm.softbank.jp
VITE_TAIGA_EMAIL=your-email@rikkeisoft.com
VITE_TAIGA_PASSWORD=your-password

# Team Members
VITE_TEAM_MEMBER_1_ID=185
VITE_TEAM_MEMBER_1_NAME=PhucLH
VITE_TEAM_MEMBER_2_ID=193
VITE_TEAM_MEMBER_2_NAME=AnVV
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

## 📁 Cấu trúc dự án

```
src/
├── components/              # React components
│   ├── Dashboard.tsx        # Dashboard tổng quan
│   ├── WeekNavigation.tsx   # Điều hướng tuần
│   ├── WeekView.tsx         # Hiển thị tasks theo tuần
│   ├── WeeklyStats.tsx      # Thống kê tuần
│   ├── MonthlyChart.tsx     # Chart thống kê theo năm
│   ├── TeamStats.tsx        # Thống kê team
│   └── TaskCard.tsx         # Card hiển thị task
├── types/                   # TypeScript type definitions
│   ├── Task.ts             # Task interfaces và enums
│   ├── WeekData.ts         # WeekData interface
│   ├── Project.ts          # Project interface
│   ├── Config.ts           # TaigaConfig interface
│   └── User.ts             # UserInfo interface
├── services/                # API services
│   └── TaigaService.ts     # Service tương tác với Taiga
├── utils/                   # Utility functions
│   └── dateUtils.ts        # Xử lý ngày tháng
├── config/                  # Configuration
│   └── env.ts              # Environment variables config
└── App.tsx                 # Component chính
```

## 🔧 Tích hợp với KonyTaiga

### API Endpoints sử dụng

- `POST /api/v1/auth` - Đăng nhập
- `GET /api/v1/projects` - Lấy danh sách projects
- `GET /api/v1/tasks` - Lấy danh sách tasks (với header x-disable-pagination)
- `GET /api/v1/userstories` - Lấy user stories

### Xử lý dữ liệu

- **Pagination**: Sử dụng header `x-disable-pagination: 1` để lấy tất cả dữ liệu
- **Date filtering**: Lọc theo `modified_date` thay vì `created_date`
- **Status mapping**: Chuyển đổi trạng thái từ Taiga sang app format
- **User assignment**: Lọc tasks theo assigned_to và assigned_users

## 📊 Trạng thái Task

### App Status

- **DONE**: Task đã hoàn thành
- **MR**: Merge Request/Ready for test
- **In Progress & Incoming**: Gộp "inprogress" và "incoming"

### Taiga Status Mapping

```typescript
done/Done/Closed → DONE
MR/Ready for test/Testing → MR
In progress/In Progress → inprogress
In Coming/New/Ready → incoming
```

## 🎨 Giao diện

### Material-UI Components

- **Cards**: Hiển thị thống kê và thông tin
- **Charts**: Recharts cho biểu đồ thống kê
- **Navigation**: WeekNavigation với date picker
- **Responsive**: Grid layout thích ứng với màn hình

### Màu sắc

- **DONE**: #4caf50 (Green)
- **MR**: #9c27b0 (Purple)
- **In Progress & Incoming**: #ff9800 (Orange)

## 🚀 Tính năng nổi bật

### 1. Thống kê đa chiều

- **Dashboard**: Tổng quan toàn bộ
- **Weekly**: Chi tiết theo tuần
- **Yearly**: So sánh theo năm
- **Team**: Phân tích theo member

### 2. Tự động hóa

- **Auto login**: Tự động đăng nhập khi khởi động
- **Session management**: Lưu và khôi phục session
- **Data fetching**: Tự động lấy dữ liệu từ API

### 3. UX/UI

- **Loading states**: Hiển thị trạng thái loading
- **Error handling**: Xử lý lỗi gracefully
- **Responsive design**: Hoạt động tốt trên mọi thiết bị

## 🔒 Bảo mật

- **Environment variables**: Thông tin nhạy cảm được lưu trong .env
- **Git ignore**: File .env không được commit
- **Token management**: Auth token được lưu an toàn trong localStorage

## 🛠️ Công nghệ sử dụng

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI components
- **Recharts** - Chart library
- **date-fns** - Xử lý ngày tháng
- **axios** - HTTP client
- **Vite** - Build tool

## 📝 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.
