import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createInteraction = (data) => api.post('/interactions/', data);
export const getInteractions = () => api.get('/interactions/');
export const getInteraction = (id) => api.get(`/interactions/${id}`);
export const updateInteraction = (id, data) => api.put(`/interactions/${id}`, data);
export const deleteInteraction = (id) => api.delete(`/interactions/${id}`);
export const sendChatMessage = (message) => api.post('/chat/', { message });

export default api;