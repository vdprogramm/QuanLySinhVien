-- Tạo admin mặc định
INSERT INTO admin_user (username, password) VALUES ('admin', 'admin123');

-- Dữ liệu sinh viên mẫu
INSERT INTO student (student_id, name, email, major) VALUES
('SV001', 'Nguyen Van A', 'a@example.com', 'Công nghệ thông tin'),
('SV002', 'Tran Thi B', 'b@example.com', 'Khoa học máy tính'),
('SV003', 'Le Van C', 'c@example.com', 'An toàn thông tin');

-- Dữ liệu khóa học mẫu
INSERT INTO course (code, name, description) VALUES
('JAVA101', 'Lập trình Java', 'Khóa học về lập trình Java cơ bản'),
('SYS202', 'Phân tích hệ thống', 'Phân tích và thiết kế hệ thống thông tin'),
('NET303', 'Mạng máy tính', 'Kiến thức về mạng máy tính và bảo mật');

-- Dữ liệu lớp học mẫu
INSERT INTO classroom (code, name) VALUES
('CNTT-K13A', 'Công nghệ thông tin K13A'),
('ATTT-K12B', 'An toàn thông tin K12B');

-- Dữ liệu điểm mẫu
INSERT INTO grade (student_id, course_id, grade) VALUES
(1, 1, 8.5),
(1, 2, 7.0),
(2, 1, 9.0),
(3, 3, 6.5);
