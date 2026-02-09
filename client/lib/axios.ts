import axios from 'axios';

// Create axios instance with default config
// Using Next.js rewrites to proxy API calls to the NestJS backend
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
    withCredentials: true, // Enable session cookies
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Don't log 401 errors for auth/me endpoint (expected when not logged in)
            const isAuthCheck = error.config?.url?.includes('/auth/me');
            const is401 = error.response.status === 401;

            if (!(isAuthCheck && is401)) {
                // Server responded with error status
                console.error('API Error:', error.response.status, error.response.data);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('Network Error:', error.message);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
