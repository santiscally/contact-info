import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://149.50.142.57:81/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
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

// Servicios de autenticación
export const authService = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
};

// Servicios de contactos
export const contactService = {
  getContacts: () => api.get('/contacts'),
  getContact: (id) => api.get(`/contacts/${id}`),
  createContact: (contactData) => api.post('/contacts', contactData),
  updateContact: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  sendEmail: (id, emailData) => api.post(`/promotions/email/${id}`, emailData),
  sendWhatsApp: (id, whatsappData) => api.post(`/promotions/whatsapp/${id}`, whatsappData),
};

export default api;