# Frontend hệ thống quản lý sinh viên

React 18 + Axios + Tailwind CSS 3. Backend độc lập trong `../backend/`.

## Vai trò
- **Admin**: quản lý sinh viên/lớp/môn/điểm/thống kê, tạo tài khoản và phân công.
- **Giảng viên**: xem môn được giao, danh sách đăng ký, nhập điểm.
- **Sinh viên**: xem hồ sơ, đăng ký môn, xem điểm cá nhân.

## Chạy
```bash
npm install
npm start
```
Mặc định gọi Backend ở `http://localhost:8080/api`. Thay bằng `REACT_APP_API_URL` trong `.env` (tham khảo `.env.example`).

## Tài khoản demo của ba vai trò

| Vai trò | Tên đăng nhập | Mật khẩu demo |
| --- | --- | --- |
| Admin (Quản trị viên) | `admin` | `DemoPass123!` |
| Lecturer (Giảng viên) | `giangvien` | `DemoPass123!` |
| Student (Sinh viên) | `sinhvien` | `DemoPass123!` |

**Chỉ có tài khoản này khi khởi chạy Backend bằng profile `demo` trên database thử nghiệm, nếu tài khoản chưa tồn tại.** Backend mặc định không tự seed các tài khoản này.

Windows PowerShell, mở terminal trong thư mục `backend/`:

```powershell
$env:SPRING_PROFILES_ACTIVE = "demo"
.\mvnw.cmd spring-boot:run
```

- Nếu thiết lập `APP_DEMO_PASSWORD`, mật khẩu mới tạo sẽ là giá trị đó.
- Nếu tài khoản đã có trong cơ sở dữ liệu, mật khẩu cũ được giữ nguyên; đừng kỳ vọng `DemoPass123!` đăng nhập được.
- **Không bật profile demo trên hosting công khai.** Thông tin này chỉ dùng khi kiểm thử cục bộ. Xem [README tổng](../README.md) để hiểu đầy đủ cách tạo dữ liệu mẫu và lưu ý bảo mật.

**Bảo mật:** Frontend hiện dùng HTTP Basic, lưu credentials Base64 trong sessionStorage; chỉ an toàn khi chạy qua HTTPS và nên tiếp tục nâng cấp cơ chế token/cookie.
