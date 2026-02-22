import api from './api';

export const getApuntes = async () => {
  const response = await api.get('/apuntes');
  return response.data;
};

export const getApunte = async (id) => {
  const response = await api.get(`/apuntes/${id}`);
  return response.data;
};

export const createApunte = async (apunteData) => {
  const response = await api.post('/apuntes', apunteData);
  return response.data;
};

export const updateApunte = async (id, apunteData) => {
  const response = await api.put(`/apuntes/${id}`, apunteData);
  return response.data;
};

export const deleteApunte = async (id) => {
  const response = await api.delete(`/apuntes/${id}`);
  return response.data;
};