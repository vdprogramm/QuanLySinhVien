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

Tài khoản demo chỉ xuất hiện khi bật `APP_SEED_DEMO=true` ở Backend. Các tài khoản là `admin`, `giangvien`, `sinhvien`; mật khẩu do bạn tự đặt bằng `APP_DEMO_PASSWORD`.

**Bảo mật:** Frontend hiện dùng HTTP Basic, lưu credentials Base64 trong sessionStorage; chỉ an toàn khi chạy qua HTTPS và nên tiếp tục nâng cấp cơ chế token/cookie.
