import axiosClient from './axiosClient';

const postApi = {
  getAll: (params, signal) => axiosClient.get('/posts', { params, signal }),
  getById: (id, signal) => axiosClient.get(`/posts/${id}`, { signal }),
  create: (data) => axiosClient.post('/posts', data),
  update: (id, data) => axiosClient.put(`/posts/${id}`, data),
  patch: (id, data) => axiosClient.patch(`/posts/${id}`, data),
  remove: (id) => axiosClient.delete(`/posts/${id}`),
};

export default postApi;