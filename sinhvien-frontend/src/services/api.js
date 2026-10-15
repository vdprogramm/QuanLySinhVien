import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:8080/api').replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const auth = sessionStorage.getItem('basicAuth');
  if (auth) config.headers.Authorization = 'Basic ' + auth;
  return config;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    sessionStorage.removeItem('basicAuth');
    sessionStorage.removeItem('account');
    if (window.location.pathname !== '/login') window.location.assign('/login');
  }
  return Promise.reject(err);
});

export const authAPI = { login: () => api.get('/me'), me: () => api.get('/me') };
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: id => api.get(`/students/${id}`),
  create: x => api.post('/students', x),
  update: (id,x) => api.put(`/students/${id}`,x),
  delete: id => api.delete(`/students/${id}`),
};
export const classroomAPI = { getAll: () => api.get('/classes'), create: x => api.post('/classes',x) };
export const courseAPI = { getAll: () => api.get('/courses'), create: x => api.post('/courses',x) };
export const gradeAPI = { getAll: () => api.get('/grades'), create: x => api.post('/grades',x) };
export const reportAPI = { getReport: () => api.get('/reports/summary') };
export const adminAPI = {
  accounts: () => api.get('/admin/accounts'),
  createAccount: x => api.post('/admin/accounts',x),
  assignLecturer: (courseId,lecturerId) => api.put(`/admin/courses/${courseId}/lecturer`,{lecturerId}),
  assignClass: (studentId,classroomId) => api.put(`/admin/students/${studentId}/classroom`,{classroomId}),
};
export const lecturerAPI = {
  courses: () => api.get('/lecturer/courses'),
  enrollments: id => api.get(`/lecturer/courses/${id}/enrollments`),
  mark: (id,studentId,grade) => api.put(`/lecturer/courses/${id}/grades`,{studentId,grade}),
};
export const portalAPI = {
  profile: () => api.get('/student/profile'),
  courses: () => api.get('/courses'),
  enrollments: () => api.get('/student/enrollments'),
  register: courseId => api.post('/student/enrollments',{courseId}),
  grades: () => api.get('/student/grades'),
};
export default api;
