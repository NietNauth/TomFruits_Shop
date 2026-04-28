import axiosClient from './axiosClient';

const storeService = {
  getStores: (params) => {
    return axiosClient.get('/stores', { params });
  }
};

export default storeService;
