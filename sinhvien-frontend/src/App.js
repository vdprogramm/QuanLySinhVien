import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import ClassroomManagement from './components/ClassroomManagement';
import CourseManagement from './components/CourseManagement';
import GradeManagement from './components/GradeManagement';
import Report from './components/Report';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="classrooms" element={<ClassroomManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="grades" element={<GradeManagement />} />
          <Route path="reports" element={<Report />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;