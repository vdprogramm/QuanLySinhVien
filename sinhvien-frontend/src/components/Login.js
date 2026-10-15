import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event){
    event.preventDefault(); setBusy(true); setError('');
    try {
      // UTF-8-safe Basic credentials for the protected API, kept only for this browser tab.
      const bytes = new TextEncoder().encode(username + ':' + password);
      const encoded = btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''));
      sessionStorage.setItem('basicAuth',encoded);
      const result = await authAPI.login();
      sessionStorage.setItem('account',JSON.stringify(result.data));
      navigate('/dashboard',{replace:true});
    } catch(err){
      sessionStorage.removeItem('basicAuth');sessionStorage.removeItem('account');
      setError('Sai tài khoản/mật khẩu hoặc không kết nối được máy chủ.');
    } finally {setBusy(false);}
  }
  return <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5" onSubmit={submit}>
      <h1 className="text-2xl font-bold text-gray-800">Đăng nhập hệ thống quản lý sinh viên</h1>
      <p className="text-gray-600">Quản trị viên · Giảng viên · Sinh viên</p>
      <label className="block">Tên đăng nhập<input className="border rounded w-full p-3 mt-1" required value={username} onChange={e=>setUsername(e.target.value)} /></label>
      <label className="block">Mật khẩu<input className="border rounded w-full p-3 mt-1" type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button disabled={busy} className="bg-blue-700 text-white rounded p-3 w-full disabled:opacity-50">{busy?'Đang đăng nhập...':'Đăng nhập'}</button>
    </form>
  </main>;
}
export default Login;
