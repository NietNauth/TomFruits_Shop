import axiosClient from './axiosClient';

const productService = {
  /**
   * GET /products?page=1&per_page=15&category_id=&search=&tag=
   * Response: { success, data: { data: [...], total, per_page, current_page } }
   */
  getAll: (params = {}) => axiosClient.get('/products', { params }),

  /**
   * GET /products/{id}
   * Response: { success, data: product }
   */
  getById: (id) => axiosClient.get(`/products/${id}`),

  /**
   * GET /products/featured   — sản phẩm nổi bật (tag=hot)
   * GET /products/sale       — sản phẩm giảm giá (tag=sale)
   * GET /products/new        — sản phẩm mới (tag=new)
   */
  getFeatured: () => axiosClient.get('/products', { params: { is_featured: 1, per_page: 8 } }),
  getSale: () => axiosClient.get('/products', { params: { tag: 'sale', per_page: 8 } }),
  getNew: () => axiosClient.get('/products', { params: { tag: 'new', per_page: 8 } }),

  /**
   * GET /products?category_id={id}
   */
  getByCategory: (categoryId, params = {}) =>
    axiosClient.get('/products', { params: { category_id: categoryId, ...params } }),

  /**
   * GET /products?search={keyword}
   */
  search: (keyword) => axiosClient.get('/products', { params: { search: keyword } }),
};

export default productService;
