import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/incidents',
});

export const getIncidents = async (page = 1, limit = 10, search = '', severity = '', status = '', sortBy = 'createdAt', order = 'desc') => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (severity) params.append('severity', severity);
  if (status) params.append('status', status);
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);
  
  const response = await api.get(`?${params.toString()}`);
  return response.data;
};

export const getIncidentById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createIncident = async (data) => {
  const response = await api.post('/', data);
  return response.data;
};

export const updateIncident = async (id, data) => {
  const response = await api.patch(`/${id}`, data);
  return response.data;
};

export default api;

