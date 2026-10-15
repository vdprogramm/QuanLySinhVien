# Triển khai QuanLySinhVien: React + Spring Boot + MySQL

**Hệ quản trị cơ sở dữ liệu của dự án là MySQL ở cả local và production. Không dùng PostgreSQL.** Frontend React chạy trên Vercel, Backend Spring Boot chạy trên Render và kết nối tới MySQL có địa chỉ truy cập từ Render.

## Bước 1 – Chuẩn bị MySQL truy cập được từ Render

- Dùng MySQL **đang được lưu trữ tại máy chủ hoặc dịch vụ MySQL bên ngoài** (ví dụ MySQL managed của nhà cung cấp bạn chọn). Render Blueprint của dự án **không tạo MySQL**.
- Nếu MySQL hiện chỉ ở `localhost:3306` trên máy Windows của bạn, Render **không kết nối được** bằng địa chỉ localhost đó. Phải chuyển sang MySQL có hostname mạng, cấu hình kết nối an toàn và quyền truy cập phù hợp.
- Tạo database `sinhviendb`, tạo user ứng dụng có quyền cần thiết trên database đó; không dùng tài khoản root cho production.
- Lấy host, port, tên database, username, password và thông số SSL từ nhà cung cấp MySQL.
- Sao lưu nếu chuyển từ một MySQL có dữ liệu sẵn; kiểm tra trùng dữ liệu (nhất là điểm đăng ký) trước khi chạy JPA `ddl-auto=update`.
- Nếu MySQL hỗ trợ TLS, sử dụng tùy chọn `sslMode=REQUIRED` và kiểm tra chính sách chứng chỉ của nhà cung cấp.

**Biến Render cần nhập thủ công (không đưa mật khẩu lên Git):**

| Biến | Ví dụ minh họa |
| --- | --- |
| `DATABASE_URL` | `jdbc:mysql://db.example.com:3306/sinhviendb?sslMode=REQUIRED&serverTimezone=UTC` |
| `DB_USERNAME` | `qlsv_app` |
| `DB_PASSWORD` | Mật khẩu MySQL thực tế, lưu dạng secret |
| `APP_BOOTSTRAP_ADMIN_PASSWORD` | Mật khẩu Admin riêng, dài >=12 ký tự, KHÔNG dùng `DemoPass123!` |
| `CORS_ALLOWED_ORIGINS` | `https://ten-frontend.vercel.app` |

`DB_PASSWORD` và `APP_BOOTSTRAP_ADMIN_PASSWORD` không được công bố, commit vào repository hay gửi vào README.

## Bước 2 – Deploy Backend Spring Boot lên Render

1. Kết nối GitHub repository `vdprogramm/QuanLySinhVien` với Render.
2. Vào **New → Blueprint**, trỏ đến `render.yaml` ở thư mục gốc.
3. Blueprint tạo **một** web service `qlsv-backend` với Dockerfile trong `backend/`, **không tạo PostgreSQL** hoặc database mới.
4. Điền toàn bộ biến môi trường cần thiết ở trên; `SPRING_PROFILES_ACTIVE=prod` và `APP_SEED_DEMO=false` đã được khai báo.
5. Kiểm tra log deploy Spring Boot, truy cập `https://<backend-service>.onrender.com/api/health`; mong đợi JSON `{"status":"UP"}` nếu kết nối MySQL hoạt động.
6. Khi khởi tạo trên **database mới**, Backend tự tạo Admin có username `admin`, mật khẩu bạn đã đặt ở biến môi trường. Không tự tạo tài khoản giảng viên/sinh viên với mật khẩu công khai. Admin tạo các tài khoản đó từ giao diện.

## Bước 3 – Deploy Frontend React lên Vercel

1. Vào **Add New → Project**, import repository GitHub `vdprogramm/QuanLySinhVien`.
2. Đặt **Root Directory = `sinhvien-frontend`**.
3. Chọn Create React App; cấu hình build bằng `npm run build`, output `build` và sử dụng `vercel.json`.
4. Thêm `REACT_APP_API_URL=https://<backend-service>.onrender.com/api` vào Vercel trước khi build.
5. Deploy. Sau khi Vercel cấp URL thực tế, cập nhật Render `CORS_ALLOWED_ORIGINS` thành origin đó (không có dấu `/` cuối), rồi redeploy backend nếu cần.
6. Kiểm tra luồng Admin → tạo Giảng viên/Sinh viên → phân công môn → sinh viên đăng ký → giảng viên nhập điểm → sinh viên xem điểm.

## Chạy local
Profile mặc định dùng MySQL local qua `backend/src/main/resources/application.properties`. Profile `prod` cũng dùng MySQL nhưng buộc cấu hình `DATABASE_URL` thực tế từ môi trường. Profile `demo` chỉ dành cho thử nghiệm cục bộ; **không bật `demo` hoặc `APP_SEED_DEMO=true` trên Render**.

## Lưu ý bảo mật
Frontend hiện dùng HTTP Basic + sessionStorage và chỉ phù hợp với demo HTTPS; nên chuyển sang đăng nhập qua cookie HttpOnly/session hoặc token ngắn hạn trước khi xử lý dữ liệu sinh viên thật. Cơ chế `ddl-auto=update` hiện phục vụ phát triển, nên thay bằng Flyway/Liquibase trước production. Kiểm tra backup và giới hạn IP/SSL của MySQL.
