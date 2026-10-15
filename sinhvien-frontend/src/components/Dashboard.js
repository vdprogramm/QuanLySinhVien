import React from 'react';
import { Link } from 'react-router-dom';
const links={
 ADMIN:[['/students','Quản lý sinh viên'],['/classrooms','Quản lý lớp'],['/courses','Quản lý môn học'],['/grades','Quản lý điểm'],['/reports','Thống kê'],['/admin','Tài khoản và phân công']],
 LECTURER:[['/lecturer','Lớp giảng dạy & nhập điểm']],
 STUDENT:[['/student','Hồ sơ, đăng ký môn & xem điểm']],
};
export default function Dashboard(){
 const u=JSON.parse(sessionStorage.getItem('account')||'{}');
 return <section><h1 className="text-3xl font-bold mb-5">Xin chào, {u.displayName||u.username}!</h1>
 <p className="mb-6">Chọn một phân hệ để bắt đầu.</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {(links[u.role]||[]).map(([href,label])=><Link key={href} to={href} className="bg-white shadow rounded-lg p-6 text-lg font-semibold text-blue-700 hover:shadow-lg">{label}</Link>)}
 </div></section>;
}
