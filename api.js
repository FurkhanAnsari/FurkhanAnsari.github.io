import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Students
  getStudents: (params) => api.get('/admin/students', { params }),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  
  // Teachers
  getTeachers: (params) => api.get('/admin/teachers', { params }),
  createTeacher: (data) => api.post('/admin/teachers', data),
  updateTeacher: (id, data) => api.put(`/admin/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/admin/teachers/${id}`),
  assignClasses: (id, data) => api.put(`/admin/teachers/${id}/assign-classes`, data),
  
  // Fees
  getFees: (params) => api.get('/admin/fees', { params }),
  recordManualFee: (data) => api.post('/admin/fees/manual', data),
};

// Teacher API
export const teacherAPI = {
  getDashboard: () => api.get('/teacher/dashboard'),
  getProfile: () => api.get('/teacher/profile'),
  updateProfile: (data) => api.put('/teacher/profile', data),
  getSchedule: () => api.get('/teacher/schedule'),
  getStudents: (params) => api.get('/teacher/students', { params }),
  getStudent: (id) => api.get(`/teacher/students/${id}`),
  addGrade: (studentId, data) => api.post(`/teacher/students/${studentId}/grades`, data),
  markAttendance: (studentId, data) => api.post(`/teacher/students/${studentId}/attendance`, data),
  markBulkAttendance: (data) => api.post('/teacher/attendance/bulk', data),
};

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  getGrades: (params) => api.get('/student/grades', { params }),
  getAttendance: (params) => api.get('/student/attendance', { params }),
  getFees: () => api.get('/student/fees'),
  getReceipt: (feeId) => api.get(`/student/fee/${feeId}/receipt`),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payment/create-intent', data),
  confirmPayment: (data) => api.post('/payment/confirm', data),
  getHistory: () => api.get('/payment/history'),
};

export default api;

