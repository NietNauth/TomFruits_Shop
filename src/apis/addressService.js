import axiosClient from './axiosClient';

const addressService = {
  getAddresses: () => axiosClient.get('/addresses'),
  createAddress: (data) => axiosClient.post('/addresses', data),
  updateAddress: (id, data) => axiosClient.put(`/addresses/${id}`, data),
  deleteAddress: (id) => axiosClient.delete(`/addresses/${id}`),
  setDefault: (id) => axiosClient.patch(`/addresses/${id}/default`),
};

export default addressService;
