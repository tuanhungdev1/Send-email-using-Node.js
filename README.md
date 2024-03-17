# Send Email Using Node.js

## Mô tả

Đây là một ứng dụng Node.js sử dụng ExpressJS và MySQL để gửi email mã OTP xác nhận cho người dùng.

## Cài đặt

1. Clone repository này:

```
git clone <[link_repository](https://github.com/tuanhungdev1/Send-email-using-Node.js.git)>
```

2. Di chuyển vào thư mục dự án:

```
cd send-email-nodejs
```

3. Cài đặt các dependencies:

```
npm install
```

4. Cấu hình biến môi trường:

Tạo một tệp `.env` trong thư mục gốc của dự án và cung cấp các thông tin sau:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=database_name
USERNAME_GMAIL=your_gmail_username
PASSWORD_GMAIL=your_gmail_password
```

5. Chạy ứng dụng:

```
npm start
```

6. Sử dụng API để gửi email OTP:

```
POST /api/send-otp
```

Gửi một yêu cầu POST với dữ liệu JSON chứa địa chỉ email của người dùng:

```json
{
  "email": "example@example.com"
}
```

## Sử dụng

- Ứng dụng này cho phép bạn gửi mã OTP xác nhận qua email cho người dùng.
- Khi một yêu cầu POST được gửi đến `/api/send-otp` với địa chỉ email của người dùng, mã OTP sẽ được gửi đến email đó.
- Ứng dụng này sử dụng MySQL để lưu trữ thông tin người dùng và thông tin về mã OTP.

## Các công nghệ chính

- Node.js
- Express.js
- MySQL
- Nodemailer
