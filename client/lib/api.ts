import apiClient from './axios';

// AI-related API calls
export const aiApi = {
    // Generate topics for study plan
    generateTopics: async (data: { prompt: string; level: string; excludeTopics?: string[] }) => {
        const response = await apiClient.post('/api/ai/generate-topics', data);
        return response.data;
    },

    // Generate complete study plan
    generatePlan: async (data: { prompt: string; level: string; selectedTopics: string[] }) => {
        const response = await apiClient.post('/api/ai/generate-plan', data);
        return response.data;
    },

    // Refine existing study plan with additional topics
    refinePlan: async (data: { studyPlanId: string; additionalTopics: string[] }) => {
        const response = await apiClient.post('/api/ai/refine-plan', data);
        return response.data;
    },
};

// Study Plans API calls
export const studyPlansApi = {
    // Get all study plans for the logged-in user with pagination
    getAll: async (page: number = 1, limit: number = 9) => {
        const response = await apiClient.get(`/api/study-plans?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get a specific study plan by ID
    getOne: async (id: string) => {
        const response = await apiClient.get(`/api/study-plans/${id}`);
        return response.data;
    },
};

// You can add more API categories here as needed
// export const userApi = { ... };
// export const courseApi = { ... };
