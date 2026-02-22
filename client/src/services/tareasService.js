import api from './api';

export const getTareas = async () => {
  const response = await api.get('/tareas');
  return response.data;
};

export const getTarea = async (id) => {
  const response = await api.get(`/tareas/${id}`);
  return response.data;
};

export const createTarea = async (tareaData) => {
  const response = await api.post('/tareas', tareaData);
  return response.data;
};

export const updateTarea = async (id, tareaData) => {
  const response = await api.put(`/tareas/${id}`, tareaData);
  return response.data;
};

export const deleteTarea = async (id) => {
  const response = await api.delete(`/tareas/${id}`);
  return response.data;
};