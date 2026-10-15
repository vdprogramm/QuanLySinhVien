import React from 'react';
import { BrowserRouter as Router,Routes,Route,Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import ClassroomManagement from './components/ClassroomManagement';
import CourseManagement from './components/CourseManagement';
import GradeManagement from './components/GradeManagement';
import Report from './components/Report';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminPortal from './components/AdminPortal';
import LecturerPortal from './components/LecturerPortal';
import StudentPortal from './components/StudentPortal';

function Guard({role,children}){
  const account=JSON.parse(sessionStorage.getItem('account')||'{}');
  return account.role===role ? children : <Navigate to="/dashboard" replace/>;
}
function App(){
 return <Router><Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/" element={<PrivateRoute><Layout/></PrivateRoute>}>
    <Route index element={<Navigate to="/dashboard" replace/>}/>
    <Route path="dashboard" element={<Dashboard/>}/>
    <Route path="students" element={<Guard role="ADMIN"><StudentManagement/></Guard>}/>
    <Route path="classrooms" element={<Guard role="ADMIN"><ClassroomManagement/></Guard>}/>
    <Route path="courses" element={<Guard role="ADMIN"><CourseManagement/></Guard>}/>
    <Route path="grades" element={<Guard role="ADMIN"><GradeManagement/></Guard>}/>
    <Route path="reports" element={<Guard role="ADMIN"><Report/></Guard>}/>
    <Route path="admin" element={<Guard role="ADMIN"><AdminPortal/></Guard>}/>
    <Route path="lecturer" element={<Guard role="LECTURER"><LecturerPortal/></Guard>}/>
    <Route path="student" element={<Guard role="STUDENT"><StudentPortal/></Guard>}/>
  </Route><Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes></Router>;
}
export default App;
