import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    getMe: () => API.get('/auth/me'),
    getCurrentUser: () => API.get('/auth/me') // Add this alias for AuthContext
};

// Users endpoints (for profile management)
export const usersAPI = {
    getProfile: () => API.get('/profile/me'),
    updateProfile: (data) => API.put('/profile/update', data),
    getAllStudents: () => API.get('/users/students'),
    getAllTutors: () => API.get('/users/tutors')
};

// Topics endpoints
export const topicsAPI = {
    getAll: () => API.get('/topics'),
    getById: (id) => API.get(`/topics/${id}`),
    create: (data) => API.post('/topics', data),
    update: (id, data) => API.put(`/topics/${id}`, data),
    delete: (id) => API.delete(`/topics/${id}`),
    addComment: (id, comment) => API.post(`/topics/${id}/comments`, { comment })
};

// Resources endpoints
export const resourcesAPI = {
    upload: (formData) => API.post('/resources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getByTopic: (topicId) => API.get(`/resources/topic/${topicId}`),
    download: (id) => API.get(`/resources/download/${id}`, { responseType: 'blob' }),
    getAll: () => API.get('/resources')
};

// Messages endpoints
export const messagesAPI = {
    getConversations: () => API.get('/messages/conversations'),
    getMessages: (userId) => API.get(`/messages/${userId}`),
    sendMessage: (recipientId, message) => API.post('/messages', { recipientId, message })
};

// Dashboard endpoints
export const dashboardAPI = {
    getStudentStats: () => API.get('/dashboard/student'),
    getTutorStats: () => API.get('/dashboard/tutor'),
    getAdminStats: () => API.get('/dashboard/admin')
};

// Course endpoints
export const coursesAPI = {
    getAll: () => API.get('/courses'), // for listing all courses
    getEnrolled: () => API.get('/courses/enrolled'), // for student dashboard
    getById: (id) => API.get(`/courses/${id}`), // for CourseDetail.jsx
    assignStudent: (courseId, studentId) =>
        API.post('/courses/assign', { courseId, studentId }),
    submitAssignment: (courseId, formData) =>
        API.post(`/courses/${courseId}/submit`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
};


export default API;
