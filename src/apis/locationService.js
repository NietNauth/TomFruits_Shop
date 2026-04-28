import axios from 'axios';

const locationService = {
  getProvinces: async () => {
    const res = await axios.get('https://provinces.open-api.vn/api/?depth=2');
    return res.data;
  }
};

export default locationService;
