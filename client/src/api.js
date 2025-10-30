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
    getCurrentUser: () => API.get('/auth/me')
};

// Users endpoints 
export const usersAPI = {
    getProfile: () => API.get('/profile/me'),
    updateProfile: (data) => API.put('/profile/update', data),
    getAllStudents: () => API.get('/users/students'),
    getAllTutors: () => API.get('/users/tutors'),
    // admin functions
    getRecentUsers: () => API.get('/users/recent'),
    getPendingTutors: () => API.get('/users/tutors/pending'),
    approveTutor: (id) => API.put(`/users/tutors/${id}/approve`),
    rejectTutor: (id, reason) => API.put(`/users/tutors/${id}/reject`, { reason }),
    getUserActivity: (id) => API.get(`/users/${id}/activity`),
    banUser: (id) => API.put(`/users/${id}/ban`),
    unbanUser: (id) => API.put(`/users/${id}/unban`)
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
    getAdminStats: () => API.get('/admin/dashboard'), 
   
    getReports: () => API.get('/admin/reports'),
    deleteReport: (id) => API.delete(`/admin/reports/${id}`),
    resolveReport: (id) => API.put(`/admin/reports/${id}/resolve`)
};


export const coursesAPI = {
    getAll: () => API.get('/courses'),
    getById: (id) => API.get(`/courses/${id}`),
    create: (courseData) =>API.post('/courses', courseData),
    update: (id, courseData) => API.put(`/courses/${id}`, courseData),
    delete: (id) => API.delete(`/courses/${id}`),
    enroll: (id) => API.post(`/courses/${id}/enroll`),
    getMyCourses: () => API.get('/courses/my/courses')
};

<<<<<<< HEAD
=======

>>>>>>> dev-themba


export default API;