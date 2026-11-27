
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicbridge_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const authAPI = {
  register: (data: {
    name: string
    email: string
    password: string
    phone?: string
  }) => api.post('/auth/register', data),

  citizenLogin: (data: { email: string; password: string }) =>
    api.post('/auth/citizen/login', data),

  departmentLogin: (data: { department: string; email: string; password: string }) =>
    api.post('/auth/department/login', data),

  getMe: () => api.get('/auth/me'),
}

export const complaintAPI = {
  getAll: (params?: Record<string, string>) =>
    api.get('/complaints', { params }),

  getMine: () => api.get('/complaints/my'),

  getOne: (id: string) => api.get(`/complaints/${id}`),

  create: (data: FormData) =>
    api.post('/complaints', data),

  support: (id: string) =>
    api.post(`/complaints/${id}/support`),

  updateStatus: (id: string, status: string, message: string) =>
    api.patch(`/complaints/${id}/status`, { status, message }),
}

export const impactAPI = {
  getMine: () => api.get('/impact/me'),
  getLeaderboard: () => api.get('/impact/leaderboard'),
}

export const reportAPI = {
  listMonths: () => api.get('/reports/monthly'),
  getMonth: (month: string, department?: string) =>
    api.get(`/reports/monthly/${month}`, { params: department ? { department } : undefined }),
  regenerate: (month: string) => api.post(`/reports/monthly/${month}/regenerate`),
}

export default api
