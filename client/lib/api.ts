import apiClient from './axios';

// AI-related API calls
export const aiApi = {
    // Generate topics for study plan
    generateTopics: async (data: { prompt: string; level: string }) => {
        const response = await apiClient.post('/api/ai/generate-topics', data);
        return response.data;
    },

    // Generate complete study plan
    generatePlan: async (data: { prompt: string; level: string; selectedTopics: string[] }) => {
        const response = await apiClient.post('/api/ai/generate-plan', data);
        return response.data;
    },
};

// You can add more API categories here as needed
// export const userApi = { ... };
// export const courseApi = { ... };
