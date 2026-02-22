import api from './api';

export const getMaterias = async () => {
  const response = await api.get('/materias');
  return response.data;
};

export const getMateria = async (id) => {
  const response = await api.get(`/materias/${id}`);
  return response.data;
};

export const createMateria = async (materiaData) => {
  const response = await api.post('/materias', materiaData);
  return response.data;
};

export const updateMateria = async (id, materiaData) => {
  const response = await api.put(`/materias/${id}`, materiaData);
  return response.data;
};

export const deleteMateria = async (id) => {
  const response = await api.delete(`/materias/${id}`);
  return response.data;
};