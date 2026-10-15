import React,{useEffect,useState} from 'react';
import {adminAPI,studentAPI,courseAPI,classroomAPI} from '../services/api';
export default function AdminPortal(){
 const [users,setUsers]=useState([]),[students,setStudents]=useState([]),[courses,setCourses]=useState([]),[classes,setClasses]=useState([]);
 const [form,setForm]=useState({username:'',displayName:'',password:'',role:'LECTURER',studentId:''});
 const [assignment,setAssignment]=useState({courseId:'',lecturerId:'',studentId:'',classroomId:''});
 const [msg,setMsg]=useState('');
 const load=async()=>{try{
  const [u,s,c,cl]=await Promise.all([adminAPI.accounts(),studentAPI.getAll(),courseAPI.getAll(),classroomAPI.getAll()]);
  setUsers(u.data);setStudents(s.data);setCourses(c.data);setClasses(cl.data);
 }catch(e){setMsg('Không thể tải dữ liệu.');}};
 useEffect(()=>{load();},[]);
 const exec=async task=>{setMsg('');try{await task();setMsg('Đã lưu thành công');await load();}catch(e){setMsg(e.response?.data?.detail||e.response?.data?.message||'Thao tác thất bại. Kiểm tra dữ liệu hoặc trùng lặp.');}};
 return <div className="space-y-6"><h1 className="text-2xl font-bold">Tài khoản và phân công</h1>
 {msg&&<p role="status" className="bg-blue-50 p-3">{msg}</p>}
 <form className="bg-white p-5 rounded shadow grid gap-3" onSubmit={e=>{e.preventDefault();exec(()=>adminAPI.createAccount({...form,studentId:form.role==='STUDENT'?Number(form.studentId):null}));}}>
  <h2 className="font-bold text-xl">Tạo tài khoản</h2>
  <input required placeholder="Tên đăng nhập" className="border rounded p-2" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
  <input required placeholder="Họ và tên" className="border rounded p-2" value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})}/>
  <input required minLength={8} type="password" placeholder="Mật khẩu (ít nhất 8 ký tự)" className="border rounded p-2" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
  <label>Vai trò<select className="border p-2 ml-2" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="LECTURER">Giảng viên</option><option value="STUDENT">Sinh viên</option><option value="ADMIN">Quản trị viên</option></select></label>
  {form.role==='STUDENT'&&<label>Hồ sơ sinh viên<select required className="border p-2 ml-2" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})}><option value="">Chọn sinh viên</option>{students.map(s=><option value={s.id} key={s.id}>{s.studentId} – {s.name}</option>)}</select></label>}
  <button className="bg-blue-700 text-white p-2 rounded">Tạo tài khoản</button>
 </form>
 <div className="bg-white p-5 rounded shadow"><h2 className="font-bold mb-3">Danh sách tài khoản</h2>{users.map(u=><div className="border-b py-2" key={u.id}>{u.displayName} – {u.username} ({u.role})</div>)}</div>
 <div className="bg-white p-5 rounded shadow space-y-3"><h2 className="font-bold text-xl">Phân công giảng viên</h2>
 <select className="border p-2 w-full" value={assignment.courseId} onChange={e=>setAssignment({...assignment,courseId:e.target.value})}><option value="">Chọn môn học</option>{courses.map(c=><option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}</select>
 <select className="border p-2 w-full" value={assignment.lecturerId} onChange={e=>setAssignment({...assignment,lecturerId:e.target.value})}><option value="">Chọn giảng viên</option>{users.filter(u=>u.role==='LECTURER').map(u=><option key={u.id} value={u.id}>{u.displayName}</option>)}</select>
 <button disabled={!assignment.courseId||!assignment.lecturerId} className="bg-blue-700 text-white p-2 rounded disabled:opacity-50" onClick={()=>exec(()=>adminAPI.assignLecturer(assignment.courseId,Number(assignment.lecturerId)))}>Lưu phân công</button>
 </div>
 <div className="bg-white p-5 rounded shadow space-y-3"><h2 className="font-bold text-xl">Xếp sinh viên vào lớp</h2>
 <select className="border p-2 w-full" value={assignment.studentId} onChange={e=>setAssignment({...assignment,studentId:e.target.value})}><option value="">Chọn sinh viên</option>{students.map(s=><option key={s.id} value={s.id}>{s.studentId} – {s.name}</option>)}</select>
 <select className="border p-2 w-full" value={assignment.classroomId} onChange={e=>setAssignment({...assignment,classroomId:e.target.value})}><option value="">Chọn lớp học</option>{classes.map(c=><option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}</select>
 <button disabled={!assignment.studentId||!assignment.classroomId} className="bg-blue-700 text-white p-2 rounded disabled:opacity-50" onClick={()=>exec(()=>adminAPI.assignClass(assignment.studentId,Number(assignment.classroomId)))}>Lưu lớp học</button>
 </div>
 </div>;
}
