import axiosClient from './axiosClient';

const categoryService = {
  /**
   * GET /categories
   * Response: { success, data: [{ id, title }, ...] }
   */
  getAll: () => axiosClient.get('/categories'),
  getHome: () => axiosClient.get('/categories/home'),
  /**
   * GET /categories/{id}
   */
  getById: (id) => axiosClient.get(`/categories/${id}`),
};

export default categoryService;
