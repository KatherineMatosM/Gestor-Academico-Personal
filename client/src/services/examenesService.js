import api from './api';

export const getExamenes = async () => {
  const response = await api.get('/examenes');
  return response.data;
};

export const getExamen = async (id) => {
  const response = await api.get(`/examenes/${id}`);
  return response.data;
};

export const createExamen = async (examenData) => {
  const response = await api.post('/examenes', examenData);
  return response.data;
};

export const updateExamen = async (id, examenData) => {
  const response = await api.put(`/examenes/${id}`, examenData);
  return response.data;
};

export const deleteExamen = async (id) => {
  const response = await api.delete(`/examenes/${id}`);
  return response.data;
};