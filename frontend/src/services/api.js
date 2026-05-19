// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Adjuntar token JWT automáticamente en cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lesmoda_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el token expira, limpiar sesión
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lesmoda_token');
      localStorage.removeItem('lesmoda_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ── Productos ──────────────────────────────────────────────────────────────
export const productService = {
  getAll:    (params) => api.get('/products', { params }),
  getAllAdmin: (params) => api.get('/products', { params: { ...params, admin: 'true' } }),
  getStats:  ()       => api.get('/products/stats'),
  getOne:    (slug)   => api.get(`/products/${slug}`),
  create:    (data)   => api.post('/products', data),          // data = FormData
  update:    (id, data) => api.put(`/products/${id}`, data),   // data = FormData
  remove:    (id)     => api.delete(`/products/${id}`),
  trackClick: (id)   => api.post(`/products/${id}/click`),
};

// ── Auth ───────────────────────────────────────────────────────────────────
export const authService = {
  login:      (creds) => api.post('/auth/login', creds),
  me:         ()      => api.get('/auth/me'),
  createUser: (data)  => api.post('/auth/register', data),
};

// ── Pedidos ────────────────────────────────────────────────────────────────
export const orderService = {
  create:     (data) => api.post('/orders', data),
  getAll:     (params) => api.get('/orders', { params }),
  getStats:   ()      => api.get('/orders/stats'),
  getOne:     (id)    => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  updateNotes:  (id, notes)  => api.patch(`/orders/${id}/notes`, { notes }),
};

// ── Config ─────────────────────────────────────────────────────────────────
export const configService = {
  get:  ()      => api.get('/config'),
  save: (data)  => api.put('/config', data),
};

export default api;
