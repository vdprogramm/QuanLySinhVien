import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (username, password) => api.post('/login', { username, password }),
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  delete: (id) => api.delete(`/students/${id}`),
};

export const classroomAPI = {
  getAll: () => api.get('/classes'),
  create: (classroom) => api.post('/classes', classroom),
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  create: (course) => api.post('/courses', course),
};

export const gradeAPI = {
  getAll: () => api.get('/grades'),
  create: (grade) => api.post('/grades', grade),
};

export const reportAPI = {
  getReport: () => api.get('/reports'),
};

export default api;