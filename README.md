# QuanLySinhVien – Hệ thống quản lý đào tạo 3 vai trò

## Kiến trúc
- **backend/** Java 21, Spring Boot 3.5.4, Spring Security HTTP Basic stateless, BCrypt, JPA/Hibernate, MySQL.
- **sinhvien-frontend/** React 18, React Router, Axios, Tailwind CSS 3.
- FE/BE độc lập. FE gọi các API qua `REACT_APP_API_URL` (mặc định http://localhost:8080/api).

## Bài toán nghiệp vụ và phân quyền
| Vai trò | Quyền |
|---|---|
| ADMIN | Quản lý sinh viên, lớp, khóa học, điểm, thống kê; tạo tài khoản có phân vai, liên kết sinh viên vào lớp, phân công giảng viên theo môn |
| LECTURER | Chỉ xem môn được phân công; xem danh sách sinh viên đã đăng ký các môn của mình và nhập/cập nhật điểm từ 0–10 |
| STUDENT | Xem hồ sơ của mình, danh sách môn, đăng ký môn (không trùng), xem môn đã đăng ký và điểm của riêng mình |

**RBAC được kiểm tra ở Backend bằng Spring Security.** Các endpoint legacy `/api/students`, `/api/classes`, `/api/grades`, `/api/reports/summary` chỉ ADMIN; `GET /api/courses` cho tài khoản đã xác thực, ghi môn chỉ ADMIN. Giảng viên và sinh viên không được phép đọc dữ liệu toàn trường qua các API legacy.

## Cấu trúc nghiệp vụ
`Student` có liên kết Many-to-One `Classroom`; `Course` có `lecturer` kiểu `UserAccount`; `Enrollment` nối Student–Course, có unique constraint; `Grade` nối Student–Course, có unique constraint. Tài khoản có role và tùy chọn liên kết hồ sơ sinh viên. Chưa có thời khóa biểu, học kỳ, phân nhóm buổi học, quy trình duyệt đăng ký hoặc học phí.

### API bổ sung
- `GET /api/me`: người dùng đang đăng nhập
- `POST /api/admin/accounts`, `GET /api/admin/accounts`: tạo, liệt kê tài khoản (ADMIN)
- `PUT /api/admin/courses/{id}/lecturer`: gán giảng viên cho môn (ADMIN)
- `PUT /api/admin/students/{id}/classroom`: xếp sinh viên vào lớp (ADMIN)
- `GET /api/lecturer/courses`: môn giảng dạy (LECTURER)
- `GET /api/lecturer/courses/{id}/enrollments`: sinh viên đăng ký môn được phân công (LECTURER)
- `PUT /api/lecturer/courses/{id}/grades`: nhập/sửa điểm, body `{"studentId":1,"grade":8.5}` (LECTURER)
- `GET /api/student/profile`, `GET /api/student/enrollments`, `GET /api/student/grades` (STUDENT)
- `POST /api/student/enrollments` với body `{"courseId":1}` (STUDENT)

## Cài đặt
Cần Java 21, MySQL, Node.js và npm. Tạo database `sinhviendb` hoặc sử dụng `createDatabaseIfNotExist=true` với tài khoản DB đủ quyền. Cấu hình qua biến môi trường:
- `DATABASE_URL` URL JDBC MySQL
- `DB_USERNAME`, `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS` domain React, mặc định http://localhost:3000

**Chạy Backend**
```bash
cd backend
./mvnw spring-boot:run
```
Windows dùng `mvnw.cmd spring-boot:run`.

**Chạy Frontend**
```bash
cd sinhvien-frontend
npm install
npm start
```
Đặt `REACT_APP_API_URL` trong file `.env` của Frontend khi cần trỏ tới Backend ngoài máy.

### Tài khoản đăng nhập demo – 3 vai trò (chỉ dùng để thử nghiệm)

**Mật khẩu demo mặc định chỉ có hiệu lực khi chạy Backend với Spring profile `demo` và database chưa có các tài khoản này.** Không có tài khoản/mật khẩu mặc định tự được kích hoạt trên môi trường production.

| Vai trò | Tài khoản (username) | Mật khẩu (password) | Chức năng chính |
| --- | --- | --- | --- |
| **Quản trị viên (ADMIN)** | `admin` | `DemoPass123!` | Quản lý sinh viên, lớp, môn, tài khoản, phân công và báo cáo |
| **Giảng viên (LECTURER)** | `giangvien` | `DemoPass123!` | Xem môn phụ trách, danh sách đăng ký, nhập/cập nhật điểm |
| **Sinh viên (STUDENT)** | `sinhvien` | `DemoPass123!` | Xem hồ sơ, đăng ký môn, xem kết quả học tập |

**Cách bật tài khoản demo (Windows PowerShell)** – sau khi cấu hình MySQL và tạo database thử nghiệm:

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE = "demo"
.\mvnw.cmd spring-boot:run
```

**Linux/macOS** (từ thư mục `backend/`):

```bash
SPRING_PROFILES_ACTIVE=demo ./mvnw spring-boot:run
```

Mở React tại `http://localhost:3000`, truy cập màn hình đăng nhập và sử dụng một trong ba tài khoản ở bảng trên. Lần chạy đầu, hệ thống khởi tạo mẫu một sinh viên `SV001`, một lớp `CNTT-K13A` và môn `JAVA101` nếu bảng tương ứng đang trống, đồng thời tạo các tài khoản demo chưa tồn tại.

**Các trường hợp mật khẩu có thể khác bảng:**
- Nếu đặt biến môi trường `APP_DEMO_PASSWORD`, **cả ba tài khoản mới tạo** dùng mật khẩu được đặt qua biến đó thay vì `DemoPass123!`.
- Nếu tên đăng nhập đã có từ trước, hệ thống **không ghi đè mật khẩu cũ**. Vì vậy bảng trên áp dụng cho tài khoản mới được khởi tạo trong database demo.
- Nếu không bật Spring profile `demo` (và không tự bật `APP_SEED_DEMO`), hệ thống **không tự tạo** các tài khoản trên.

**Cảnh báo:** mật khẩu demo được công khai để phục vụ học tập, tuyệt đối **không dùng chung cho tài khoản thật**. Không bật profile `demo` trên Render/VPS/hosting công khai; thay mật khẩu riêng và bảo mật đăng nhập trước khi triển khai.

### Cảnh báo và giới hạn
- Frontend hiện dùng **HTTP Basic**, giữ thông tin đăng nhập đã mã hóa Base64 trong `sessionStorage` để gửi với mỗi request. Base64 **không phải mã hóa bảo mật**. **Chỉ sử dụng qua HTTPS ở môi trường công khai**, không chạy trên HTTP ngoài localhost. Nên tiếp tục nâng cấp sang access token ngắn hạn / refresh token hoặc cookie HttpOnly.
- Database dùng `ddl-auto=update` cho phát triển; triển khai thực tế cần migration versioned Flyway/Liquibase. Nếu CSDL đang có điểm trùng theo cặp sinh viên–môn, unique constraint cần xử lý dữ liệu trước khi nâng cấp.
- Dữ liệu gốc `data.sql` không tự chạy (`spring.sql.init.mode=never`). `AdminUser` cũ không còn được dùng để đăng nhập; cần quy trình migration thủ công, không tự biến mật khẩu plaintext cũ thành tài khoản mới.
- Mật khẩu mới hash BCrypt. Không đẩy mật khẩu production lên Git.
- Chưa có integration test chạy qua MySQL; cần kiểm tra ứng dụng và regression trước khi merge và deploy.
