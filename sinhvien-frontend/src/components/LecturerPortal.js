import React,{useEffect,useState} from 'react';
import {lecturerAPI} from '../services/api';
export default function LecturerPortal(){
 const [courses,setCourses]=useState([]),[selected,setSelected]=useState(''),[roster,setRoster]=useState([]),[scores,setScores]=useState({}),[msg,setMsg]=useState('');
 useEffect(()=>{lecturerAPI.courses().then(r=>setCourses(r.data)).catch(()=>setMsg('Không lấy được danh sách môn.'));},[]);
 useEffect(()=>{if(!selected){setRoster([]);return;}lecturerAPI.enrollments(selected).then(r=>setRoster(r.data)).catch(()=>setMsg('Không thể lấy danh sách đăng ký.'));},[selected]);
 async function save(s){try{
  if(scores[s.id]==='' || scores[s.id]===undefined){setMsg('Vui lòng nhập điểm.');return;}
  await lecturerAPI.mark(selected,s.id,Number(scores[s.id]));setMsg('Đã lưu điểm cho '+s.name);
 }catch(e){setMsg('Không lưu được điểm, chỉ được nhập điểm 0–10 cho sinh viên đăng ký môn này.');}}
 return <section className="bg-white p-6 rounded shadow space-y-5">
 <h1 className="text-2xl font-bold">Giảng dạy và nhập điểm</h1>{msg&&<p role="status">{msg}</p>}
 <label>Môn học đang phụ trách <select className="border p-2 ml-2" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Chọn môn</option>{courses.map(c=><option value={c.id} key={c.id}>{c.code} – {c.name}</option>)}</select></label>
 {selected&&<div><h2 className="font-bold mb-3">Sinh viên đã đăng ký</h2>{roster.length===0&&<p>Chưa có sinh viên đăng ký.</p>}
 {roster.map(en=><div className="flex flex-wrap gap-3 items-center border-b p-3" key={en.id}>
 <span className="flex-1">{en.student?.studentId} – {en.student?.name}</span>
 <input aria-label={'Điểm '+en.student?.name} type="number" min="0" max="10" step="0.1" placeholder="Điểm (0–10)" className="border p-2 w-36" value={scores[en.student.id]??''} onChange={e=>setScores({...scores,[en.student.id]:e.target.value})}/>
 <button className="bg-blue-700 text-white rounded p-2" onClick={()=>save(en.student)}>Lưu điểm</button>
 </div>)}</div>}</section>;
}
