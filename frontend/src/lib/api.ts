import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    signup: (data: { email: string; password: string; name: string }) =>
        api.post('/auth/signup', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
};

// Trip API
export const tripAPI = {
    create: (data: any) => api.post('/trips', data),
    getAll: () => api.get('/trips'),
    getById: (id: string) => api.get(`/trips/${id}`),
    update: (id: string, data: any) => api.put(`/trips/${id}`, data),
    delete: (id: string) => api.delete(`/trips/${id}`),
};

// Itinerary API
export const itineraryAPI = {
    addStop: (tripId: string, data: any) => api.post(`/itinerary/${tripId}/stops`, data),
    removeStop: (stopId: string) => api.delete(`/itinerary/stops/${stopId}`),
    addActivity: (stopId: string, data: any) => api.post(`/itinerary/stops/${stopId}/activities`, data),
    removeActivity: (activityId: string) => api.delete(`/itinerary/activities/${activityId}`),
    reorderStops: (tripId: string, data: any) => api.put(`/itinerary/${tripId}/stops/reorder`, data),
    getItinerary: (tripId: string) => api.get(`/itinerary/${tripId}`),
};

// Budget API
export const budgetAPI = {
    getBudgetBreakdown: (tripId: string) => api.get(`/budget/${tripId}`),
    getDailyCosts: (tripId: string) => api.get(`/budget/${tripId}/daily`),
};

// Search API
export const searchAPI = {
    searchCities: (query?: string, country?: string) =>
        api.get('/search/cities', { params: { q: query, country } }),

    searchActivities: (filters: any) =>
        api.get('/search/activities', { params: filters }),

    getPopularCities: (limit: number = 10) =>
        api.get('/search/popular-cities', { params: { limit } }),
};

// Share API
export const shareAPI = {
    generateShareLink: (tripId: string) => api.post(`/share/${tripId}`),
    getPublicTrip: (shareToken: string) => api.get(`/share/public/trips/${shareToken}`),
    copyTrip: (shareToken: string) => api.post(`/share/trips/copy/${shareToken}`),
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    createUser: (data: any) => api.post('/admin/users', data),
    getAnalytics: () => api.get('/admin/analytics'),

    // City Management
    getAllCities: () => api.get('/admin/cities'),
    createCity: (data: any) => api.post('/admin/cities', data),
    updateCity: (id: string, data: any) => api.put(`/admin/cities/${id}`, data),
    deleteCity: (id: string) => api.delete(`/admin/cities/${id}`),

    // Activity Management
    getAllActivities: () => api.get('/admin/activities'),
    createActivity: (data: any) => api.post('/admin/activities', data),
    updateActivity: (id: string, data: any) => api.put(`/admin/activities/${id}`, data),
    deleteActivity: (id: string) => api.delete(`/admin/activities/${id}`),
};

// Profile API
export const profileAPI = {
    getProfile: () => api.get('/profile'),
    updateProfile: (data: any) => api.put('/profile', data),
};
