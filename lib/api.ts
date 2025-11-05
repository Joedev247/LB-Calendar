import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lb-calendar-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  getMe: () => api.get('/auth/me'),
  getOAuthAuthorizeUrl: () => api.get('/auth/oauth/authorize'),
};

// Events API
export const eventsAPI = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: number, data: any) => api.put(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params?: any) => api.get('/tasks', { params }),
  getById: (id: number) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  toggle: (id: number) => api.patch(`/tasks/${id}/toggle`),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getById: (id: number) => api.get(`/projects/${id}`),
  getMembers: (id: number) => api.get(`/projects/${id}/members`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  addMember: (id: number, data: any) => api.post(`/projects/${id}/members`, data),
  removeMember: (id: number, userId: number) => api.delete(`/projects/${id}/members/${userId}`),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  getNotifications: (id: number, params?: any) => api.get(`/users/${id}/notifications`, { params }),
  markNotificationRead: (id: number, notificationId: number) => 
    api.patch(`/users/${id}/notifications/${notificationId}`),
  getProjects: (id: number) => api.get(`/users/${id}/projects`),
  getTasks: (id: number, params?: any) => api.get(`/users/${id}/tasks`, { params }),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Chat API
export const chatAPI = {
  getMessages: (projectId: number, params?: any) => 
    api.get(`/chat/${projectId}`, { params }),
  sendMessage: (projectId: number, message: string) => 
    api.post(`/chat/${projectId}`, { message }),
  deleteMessage: (projectId: number, messageId: number) => 
    api.delete(`/chat/${projectId}/${messageId}`),
};

export default api;
