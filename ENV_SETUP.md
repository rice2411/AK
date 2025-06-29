# Environment Variables Setup

## Tạo file .env

Tạo file `.env` trong thư mục gốc của project với nội dung sau:

```env
# Taiga Configuration
VITE_TAIGA_BASE_URL=https://konytaiga.madp.tm.softbank.jp
VITE_TAIGA_EMAIL=phuclh@rikkeisoft.com
VITE_TAIGA_PASSWORD=Rikkei231023#@

# Team Members
VITE_TEAM_MEMBER_1_ID=185
VITE_TEAM_MEMBER_1_NAME=PhucLH
VITE_TEAM_MEMBER_2_ID=193
VITE_TEAM_MEMBER_2_NAME=AnVV
```

## Các biến môi trường

### Taiga Configuration

- `VITE_TAIGA_BASE_URL`: URL của Taiga server
- `VITE_TAIGA_EMAIL`: Email đăng nhập Taiga
- `VITE_TAIGA_PASSWORD`: Mật khẩu đăng nhập Taiga

### Team Members

- `VITE_TEAM_MEMBER_1_ID`: ID của member thứ nhất
- `VITE_TEAM_MEMBER_1_NAME`: Tên của member thứ nhất
- `VITE_TEAM_MEMBER_2_ID`: ID của member thứ hai
- `VITE_TEAM_MEMBER_2_NAME`: Tên của member thứ hai

## Lưu ý bảo mật

1. **Không commit file .env**: File .env chứa thông tin nhạy cảm, không nên commit vào git
2. **Sử dụng .env.example**: Tạo file .env.example làm template (không chứa thông tin thật)
3. **Fallback values**: Code có fallback values nếu không có file .env

## Cách sử dụng

1. Copy nội dung trên vào file `.env`
2. Thay đổi các giá trị theo môi trường thực tế
3. Restart development server để áp dụng thay đổi

## Validation

App sẽ tự động validate các biến môi trường và hiển thị warning nếu thiếu biến nào đó.
