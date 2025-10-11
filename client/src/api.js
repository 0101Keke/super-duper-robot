import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    getMe: () => API.get('/auth/me')
};

// Topics endpoints
export const topicsAPI = {
    getAll: () => API.get('/topics'),
    getById: (id) => API.get(`/topics/${id}`),
    create: (data) => API.post('/topics', data),
    update: (id, data) => API.put(`/topics/${id}`, data),
    delete: (id) => API.delete(`/topics/${id}`)
};

// Resources endpoints
export const resourcesAPI = {
    upload: (formData) => API.post('/resources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getByTopic: (topicId) => API.get(`/resources/topic/${topicId}`),
    download: (id) => API.get(`/resources/download/${id}`, { responseType: 'blob' })
};

export default API;