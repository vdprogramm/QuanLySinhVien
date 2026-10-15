# Hướng dẫn deploy QuanLySinhVien lên Aiven MySQL + Render + Vercel

**Sơ đồ:** React 18 (Vercel) → Spring Boot 3.5.4 / Java 21 (Render) → MySQL online (Aiven). Không sử dụng PostgreSQL và không dùng MySQL localhost làm database của Backend Render.

## 1. Tạo MySQL online mới trên Aiven Free

1. Vào [Aiven Console](https://console.aiven.io) và đăng nhập/tạo tài khoản Aiven.
2. Chọn hoặc tạo Project (ví dụ `quan-ly-sinh-vien`). Chọn **Create service → MySQL → Free**. Đặt tên dịch vụ `qlsv-mysql`. Kiểm tra kỹ gói **Free / $0** trước khi xác nhận.
3. Đợi dịch vụ có trạng thái **Running**. Aiven Free MySQL có khoảng 1 GB dung lượng và có thể tự tắt nếu bỏ không lâu ngày; thích hợp demo/học tập, không dành cho sản phẩm lớn.
4. Vào dịch vụ MySQL → **Databases → Create database** → nhập `sinhviendb`.
5. Trong mục **Users**, cân nhắc tạo user riêng `qlsv_app` cho ứng dụng; giới hạn quyền ở mức cần thiết. Nếu dùng user mặc định, nhận username được Aiven cấp (thường `avnadmin`).
6. Trong **Overview → Connection information** lưu riêng **Host, Port, Username, Password** (không gửi mật khẩu lên GitHub hoặc chat).
7. Lấy **cổng Port đúng của Aiven**, không mặc định 3306. Aiven có cấu hình riêng theo dịch vụ.

Tạo giá trị `DATABASE_URL` cho Render theo mẫu (thay placeholder bằng giá trị thật):
```text
jdbc:mysql://<AIVEN_MYSQL_HOST>:<AIVEN_MYSQL_PORT>/sinhviendb?sslMode=REQUIRED&serverTimezone=UTC
```
`sslMode=REQUIRED` bật TLS nhưng không xác minh chứng chỉ server; để bảo mật cao hơn, cấu hình CA do Aiven cung cấp và dùng `VERIFY_IDENTITY` theo hướng dẫn của nhà cung cấp.

## 2. Deploy Spring Boot Backend lên Render

1. Sau khi merge PR sửa MySQL, trong Render chọn **New → Blueprint**, import repository `vdprogramm/QuanLySinhVien`, file `render.yaml` ở thư mục gốc.
2. Blueprint tạo duy nhất Web Service Docker `qlsv-backend` (nó **không tạo MySQL**). Dockerfile nằm ở `backend/Dockerfile`.
3. Thiết lập biến môi trường (các giá trị bí mật nhập trực tiếp trên Render Dashboard):

| Key | Value / yêu cầu |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | URL JDBC MySQL Aiven ở bước 1 |
| `DB_USERNAME` | Username MySQL được Aiven cấp |
| `DB_PASSWORD` | Mật khẩu MySQL, **bí mật** |
| `APP_BOOTSTRAP_ADMIN_USERNAME` | `admin` |
| `APP_BOOTSTRAP_ADMIN_PASSWORD` | Một mật khẩu Admin tự chọn, ít nhất 12 ký tự, **khác `DemoPass123!`** |
| `APP_SEED_DEMO` | `false` |
| `CORS_ALLOWED_ORIGINS` | URL gốc Frontend Vercel, không có dấu `/` cuối; tạm dùng `http://localhost:3000` nếu FE chưa có |

4. Đợi build Docker và Spring Boot khởi động. Kiểm tra log lỗi kết nối DB/port/SSL nếu có.
5. URL `https://<BACKEND_SERVICE>.onrender.com/api/health` sẽ trả về `{"status":"UP"}` khi database khả dụng. Đây là endpoint health check, không phải URL demo FE.
6. Với **database mới**, backend tạo tài khoản `admin` bằng mật khẩu bí mật ở trên lần chạy đầu. **Không có sẵn giảng viên/sinh viên với mật khẩu công khai trên môi trường trực tuyến**; Admin tạo tài khoản của họ qua giao diện.

## 3. Deploy React Frontend lên Vercel

1. Vào Vercel → **Add New → Project** → Import GitHub `vdprogramm/QuanLySinhVien`.
2. Thiết lập **Root Directory**: `sinhvien-frontend`. Framework **Create React App**, Build Command `npm run build`, Output Directory `build`; đã có file `sinhvien-frontend/vercel.json`.
3. Thêm biến môi trường `REACT_APP_API_URL=https://<BACKEND_SERVICE>.onrender.com/api`. **Không** để `http://localhost:8080/api`.
4. Nhấn Deploy. Lấy URL Frontend thật từ Vercel, rồi vào Render chỉnh `CORS_ALLOWED_ORIGINS` thành đúng origin Vercel đó; triển khai lại Backend nếu cần.
5. Test đầy đủ: Admin đăng nhập → thêm hồ sơ sinh viên → tạo Lecturer/Student → gán lớp và phân công môn → sinh viên đăng ký môn → giảng viên chấm điểm → sinh viên xem điểm.
6. Kiểm tra Console/Network trong trình duyệt nếu request API không trả dữ liệu; phải chắc chắn API dùng HTTPS và CORS khớp chính xác.

## Các lưu ý quan trọng

- Gói Aiven Free có thể tắt khi không có hoạt động. Aiven hỗ trợ sao lưu nhưng cần kiểm tra chính sách sử dụng/duy trì riêng của bạn.
- `spring.jpa.hibernate.ddl-auto=update` đang dùng để minh họa; đối với dữ liệu thực, nên chuyển sang Flyway/Liquibase và tạo backup.
- Tránh `APP_SEED_DEMO=true` hoặc `SPRING_PROFILES_ACTIVE=demo` ở production.
- Frontend hiện vẫn sử dụng HTTP Basic và lưu Base64 credentials trong sessionStorage. HTTPS cần thiết, nhưng chưa giải quyết rủi ro XSS; hãy nâng cấp sang session cookie HttpOnly/CSRF trước khi chứa thông tin sinh viên thật.
- Các giá trị như `AIVEN_MYSQL_HOST` và `BACKEND_SERVICE` là placeholder. **Không có URL demo live** cho đến khi tài khoản dịch vụ được kết nối và deploy thành công.

## Nguồn tham khảo
- https://aiven.io/docs/products/mysql/concepts/mysql-free-tier
- https://aiven.io/docs/products/mysql/get-started
- https://aiven.io/docs/products/mysql/howto/create-database
- https://aiven.io/docs/products/mysql/howto/connect-with-java
