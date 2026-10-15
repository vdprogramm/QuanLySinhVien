import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
function Layout(){
  const account = JSON.parse(sessionStorage.getItem('account') || '{}');
  const navigate=useNavigate();
  const role=account.role;
  const nav=role==='ADMIN'?
  [['/dashboard','Tổng quan'],['/students','Sinh viên'],['/classrooms','Lớp học'],['/courses','Môn học'],['/grades','Điểm'],['/reports','Thống kê'],['/admin','Tài khoản & phân công']]:
  role==='LECTURER'?[['/dashboard','Tổng quan'],['/lecturer','Giảng dạy & nhập điểm']]:
  [['/dashboard','Tổng quan'],['/student','Hồ sơ & kết quả']];
  return <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow"><div className="mx-auto max-w-7xl p-4 flex flex-wrap gap-4 items-center justify-between">
      <strong>Quản lý Sinh viên</strong>
      <span>{account.displayName} ({role==='ADMIN'?'Quản trị viên':role==='LECTURER'?'Giảng viên':'Sinh viên'})</span>
      <button className="bg-red-600 text-white rounded px-3 py-2" onClick={()=>{sessionStorage.clear();navigate('/login',{replace:true});}}>Đăng xuất</button>
    </div></header>
    <div className="max-w-7xl mx-auto p-4 flex flex-wrap gap-3">{nav.map(([path,label])=><Link className="px-3 py-2 rounded bg-white shadow hover:text-blue-700" key={path} to={path}>{label}</Link>)}</div>
    <main className="max-w-7xl mx-auto px-4 pb-8"><Outlet /></main>
  </div>;
}
export default Layout;
