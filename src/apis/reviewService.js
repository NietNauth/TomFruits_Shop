import axiosClient from './axiosClient';

const reviewService = {
  /**
   * GET /products/{productId}/reviews
   * Response: { success, data: [reviews] }
   */
  getProductReviews: (productId) => axiosClient.get(`/products/${productId}/reviews`),

  /**
   * POST /reviews
   * Body: { product_id, order_id, rating, comment }
   * Response: { success, message, data: review }
   */
  createReview: (data) => axiosClient.post('/reviews', data),
};

export default reviewService;
