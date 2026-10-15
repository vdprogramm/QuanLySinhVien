import React,{useEffect,useState} from 'react';
import {portalAPI} from '../services/api';
export default function StudentPortal(){
 const [profile,setProfile]=useState(null),[courses,setCourses]=useState([]),[enrolled,setEnrolled]=useState([]),[grades,setGrades]=useState([]),[message,setMessage]=useState('');
 async function reload(){
  try{const [p,c,e,g]=await Promise.all([portalAPI.profile(),portalAPI.courses(),portalAPI.enrollments(),portalAPI.grades()]);
    setProfile(p.data);setCourses(c.data);setEnrolled(e.data);setGrades(g.data);
  }catch(e){setMessage('Không tải được thông tin sinh viên. Hãy kiểm tra tài khoản đã được liên kết hồ sơ chưa.');}
 }
 useEffect(()=>{reload();},[]);
 async function register(id){try{await portalAPI.register(id);setMessage('Đăng ký môn thành công.');await reload();}
 catch(e){setMessage('Không đăng ký được môn; có thể bạn đã đăng ký trước đó.');}}
 const ids=new Set(enrolled.map(e=>e.course.id));
 return <div className="space-y-6"><h1 className="text-2xl font-bold">Cổng sinh viên</h1>
 {message&&<p role="status" className="p-3 bg-blue-50">{message}</p>}
 {profile&&<section className="bg-white shadow p-5 rounded"><h2 className="font-bold text-xl">Hồ sơ của tôi</h2>
 <p>Mã sinh viên: {profile.studentId}</p><p>Họ tên: {profile.name}</p><p>Email: {profile.email}</p><p>Ngành: {profile.major}</p><p>Lớp: {profile.classroom?.name||'Chưa xếp lớp'}</p></section>}
 <section className="bg-white shadow p-5 rounded"><h2 className="font-bold text-xl mb-3">Đăng ký môn học</h2>
 {courses.map(c=><div key={c.id} className="border-b p-3 flex justify-between items-center gap-3"><span>{c.code} – {c.name}</span>
 <button disabled={ids.has(c.id)} className="bg-blue-700 disabled:bg-gray-400 text-white rounded p-2" onClick={()=>register(c.id)}>{ids.has(c.id)?'Đã đăng ký':'Đăng ký'}</button></div>)}</section>
 <section className="bg-white shadow p-5 rounded"><h2 className="font-bold text-xl mb-3">Điểm của tôi</h2>
 {grades.length===0?<p>Chưa có điểm.</p>:grades.map(g=><p key={g.id} className="border-b p-2">{g.course?.name}: <strong>{g.grade}</strong></p>)}</section>
 </div>;
}
