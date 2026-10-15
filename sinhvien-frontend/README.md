# Frontend – Hệ thống Quản lý Sinh viên

React 18 (Create React App), JavaScript, React Router v6, Axios và Tailwind CSS 3. Backend Java Spring Boot được đặt ở `../backend/` và chạy độc lập.

## Cài đặt và chạy

```bash
npm install
npm start
```
Trang web tại http://localhost:3000; Backend mặc định http://localhost:8080/api.

## Khi deploy FE riêng

Sao chép `.env.example` thành `.env`, thay `REACT_APP_API_URL` bằng URL API backend công khai (bao gồm `/api`). Khởi động hoặc build lại Frontend sau khi thay biến môi trường.

## Trang có trong mã nguồn

- `/login`: đăng nhập Admin (demo, chưa có token/session bảo mật).
- `/dashboard`: điều hướng các phân hệ.
- `/students`: thêm, xem, sửa, xóa sinh viên.
- `/classrooms`: xem, thêm lớp.
- `/courses`: xem, thêm khóa học.
- `/grades`: xem, nhập điểm.
- `/reports`: thống kê `GET /api/reports/summary`.

**Lưu ý:** Chỉ tài khoản admin demo; chưa có vai trò riêng cho sinh viên, giảng viên. `PrivateRoute` chỉ kiểm tra cờ localStorage nên không thay thế xác thực Backend. Không sử dụng cho dữ liệu thực khi chưa bổ sung Spring Security.

Xem [README tổng](../README.md) để biết nghiệp vụ, bảng dữ liệu, API và các cảnh báo quan trọng.
