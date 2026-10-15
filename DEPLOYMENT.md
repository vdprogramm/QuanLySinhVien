# Triển khai QuanLySinhVien

Backend và Frontend được triển khai riêng. **Không đưa mật khẩu demo công khai lên máy chủ.**

## Backend: Render + PostgreSQL
1. Kết nối repository GitHub với Render.
2. Chọn **New > Blueprint**, trỏ đến repository và file `render.yaml`.
3. Blueprint dự kiến tạo `qlsv-backend` (Docker web service) và `qlsv-postgres` (PostgreSQL).
4. Khi được yêu cầu, nhập biến bí mật `APP_BOOTSTRAP_ADMIN_PASSWORD`: tự chọn mật khẩu mạnh ít nhất 12 ký tự, không dùng `DemoPass123!`.
5. Trong bước cấu hình, `CORS_ALLOWED_ORIGINS` phải là **URL frontend Vercel chính xác**, ví dụ `https://quanlysinhvien-abc.vercel.app`. Không dùng dấu `/` cuối hoặc `*`.
6. Sau khi deploy thành công, `https://<ten-service>.onrender.com/api/health` phải trả `{"status":"UP"}`.
7. Tài khoản production đầu tiên là `admin`, mật khẩu chính là giá trị bí mật đã nhập. Không có giảng viên/sinh viên mặc định. Admin tạo tài khoản qua màn hình quản trị.

*Render free PostgreSQL có thời hạn sử dụng; hãy chọn gói có lưu trữ lâu dài nếu cần giữ dữ liệu.* Hiện môi trường production tự update schema; trước khi dùng dữ liệu thật, cần chuyển sang migration (Flyway/Liquibase).

## Frontend: Vercel
1. Chọn **Add New > Project**, import `vdprogramm/QuanLySinhVien`.
2. Thiết lập **Root Directory = sinhvien-frontend**.
3. Framework Create React App, Build Command `npm run build`, Output Directory `build` (file `vercel.json` đã được thêm).
4. Trong **Environment Variables**, đặt `REACT_APP_API_URL=https://<ten-service>.onrender.com/api`. Đây là URL Backend thực tế, không phải placeholder.
5. Deploy React. Sau khi nhận URL Vercel, cập nhật Render `CORS_ALLOWED_ORIGINS` bằng URL Frontend và redeploy Backend.
6. Thử đăng nhập Admin, tạo Giảng viên/Sinh viên, đăng ký môn, nhập và xem điểm. Kiểm tra `GET /api/health` và quyền truy cập chéo.

## Chạy local
Profile mặc định vẫn dùng MySQL. Profile `prod` là cấu hình PostgreSQL riêng cho Render. Profile `demo` (chỉ local) có tài khoản công khai trong README; **không bật `demo` hoặc `APP_SEED_DEMO=true` trên Render**.

## Bảo mật
Ứng dụng hiện sử dụng HTTP Basic gửi credentials trong `Authorization`, Frontend giữ Base64 credentials trong sessionStorage. **Bắt buộc HTTPS và nên nâng cấp sang cookie HttpOnly hoặc phiên đăng nhập an toàn trước khi dùng dữ liệu thật**. Không ghi bí mật vào repository hoặc README.
