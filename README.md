# Hệ thống Quản lý Sinh viên (QuanLySinhVien)

Dự án demo quản lý sinh viên, lớp học, khóa học, điểm và thống kê bằng **React 18** + **Spring Boot 3.5.4 / Java 21** + **MySQL**.

## Cấu trúc đã tách

```text
QuanLySinhVien/
├── backend/                # Java Spring Boot REST API (chạy riêng)
│   ├── pom.xml
│   ├── mvnw, mvnw.cmd, .mvn/
│   ├── run-backend.bat, run-backend.ps1
│   └── src/
│       ├── main/java/com/example/sinhvienBE/
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   ├── model/
│       │   └── dto/
│       └── main/resources/
│           ├── application.properties
│           └── data.sql
├── sinhvien-frontend/      # React JS + React Router + Axios + Tailwind
│   ├── src/components/
│   ├── src/services/api.js
│   └── package.json
└── README.md
```

## Phân tích nghiệp vụ thực tế

- **Tài khoản:** chỉ có `AdminUser` và POST `/api/login`; **chưa có** tài khoản sinh viên, giáo viên, JWT, session hoặc RBAC.
- **Sinh viên:** danh sách, lấy một bản ghi, thêm, sửa và xóa. Các trường: `id`, `studentId`, `name`, `email`, `major`, `hobby`.
- **Lớp học:** danh sách và thêm; bảng `Classroom` gồm `id`, `code`, `name`; **chưa có** quan hệ `Student -> Classroom`.
- **Khóa học/môn học:** danh sách và thêm; gồm `id`, `code`, `name`, `description`.
- **Điểm:** danh sách và tạo; `Grade` gồm `id`, `grade`, liên kết Many-to-One tới `Student` và `Course`. Chưa có sửa/xóa điểm.
- **Báo cáo:** tổng số sinh viên, lớp, khóa học và điểm trung bình toàn hệ thống.
- **Dashboard:** trang liên kết đến các phân hệ; không phải bảng điều khiển KPI thời gian thực.

## Các API thực tế

| Method | Path | Mục đích |
| --- | --- | --- |
| POST | /api/login | Kiểm tra admin, trả `{ "success": boolean }` |
| GET | /api/students | Danh sách sinh viên |
| GET | /api/students/{id} | Chi tiết sinh viên |
| POST | /api/students | Thêm sinh viên |
| PUT | /api/students/{id} | Cập nhật sinh viên |
| DELETE | /api/students/{id} | Xóa sinh viên |
| GET, POST | /api/classes | Xem hoặc thêm lớp học |
| GET, POST | /api/courses | Xem hoặc thêm khóa học |
| GET, POST | /api/grades | Xem hoặc nhập điểm |
| GET | /api/reports/summary | Tổng hợp thống kê |

## Chạy trên máy

Cần **JDK 21**, **MySQL** và **Node.js / npm**. Tạo MySQL database `sinhviendb`; đổi username và password trong `backend/src/main/resources/application.properties` theo cấu hình cục bộ.

**Cảnh báo:** cấu hình hiện tại là `spring.jpa.hibernate.ddl-auto=create-drop` và `spring.sql.init.mode=always`: schema có thể bị xóa khi khởi động/tắt ứng dụng, sau đó nạp lại `data.sql`. Không dùng dữ liệu thật với cấu hình này.

Terminal 1:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
Backend: http://localhost:8080.

Terminal 2:
```powershell
cd sinhvien-frontend
npm install
npm start
```
Frontend: http://localhost:3000.

Khi chạy Frontend ở máy hoặc hosting riêng, sao chép `sinhvien-frontend/.env.example` thành `.env`, cấu hình `REACT_APP_API_URL=https://your-backend.example/api`, rồi khởi động/build lại. Backend cần cấu hình CORS theo domain thực tế khi đưa lên môi trường production.

## Dữ liệu demo, hạn chế và bảo mật

`data.sql` tạo sẵn **3 sinh viên, 2 lớp, 3 khóa học, 4 bản ghi điểm** và **Admin demo**. Tài khoản thử ở local: `admin` / `admin123`. **Không sử dụng mật khẩu này ngoài môi trường demo.**

**Chưa an toàn để công khai:** mật khẩu admin đang lưu plaintext, AuthService so sánh trực tiếp, Frontend lưu cờ `isAuthenticated` trong `localStorage`, các API quản lý không được bảo vệ bằng Spring Security. Cần bổ sung xác thực server, hash mật khẩu BCrypt, phân quyền, validation, xử lý lỗi, database migration và cấu hình môi trường trước khi dùng thật.

`node_modules/` hiện đã bị commit theo lịch sử repository; file `.gitignore` mới chỉ ngăn theo dõi file mới. Muốn bỏ khỏi Git index mà giữ trên máy: `git rm -r --cached sinhvien-frontend/node_modules` rồi commit riêng.

Lưu ý: `ReportService` và `ReportController` có logic thống kê trùng lặp; Frontend nay gọi báo cáo qua cùng API service và endpoint đúng `/api/reports/summary`. Việc tách thư mục không đồng nghĩa đã kiểm thử chức năng chạy thực tế.
