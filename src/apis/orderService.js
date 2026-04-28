import axiosClient from './axiosClient';

const orderService = {
  /**
   * POST /orders
   * Body: {
   *   coupon_code?,
   *   payment_method: 'cod' | 'vnpay',
   *   receiver_name, receiver_phone, shipping_address, note?
   * }
   * Response: { success, message, data: order }
   *
   * Backend sẽ tự lấy cart của user để tạo order
   */
  createOrder: (data) => axiosClient.post('/orders', data),

  /**
   * GET /orders
   * Response: { success, data: { data: [orders] } }
   */
  getOrders: (params = {}) => axiosClient.get('/orders', { params }),

  /**
   * GET /orders/{id}
   * Response: { success, data: order + order_items }
   */
  getOrderById: (id) => axiosClient.get(`/orders/${id}`),

  /**
   * DELETE /orders/{id}   — Hủy đơn (chỉ khi status=pending)
   * Response: { success, message }
   */
  cancelOrder: (id) => axiosClient.delete(`/orders/${id}`),

  /**
   * GET /vnpay-return
   * Params: vnp_... từ URL
   */
  handleVNPayReturn: (params) => axiosClient.get('/vnpay-return', { params }),
};

export default orderService;
