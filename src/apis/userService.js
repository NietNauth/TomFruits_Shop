import axiosClient from './axiosClient';

const userService = {
  /**
   * GET /orders   — Lịch sử đơn hàng của user hiện tại
   * Response: { success, data: [orders] }
   */
  getMyOrders: () => axiosClient.get('/orders'),

  /**
   * GET /orders/{id}
   */
  getOrderDetail: (orderId) => axiosClient.get(`/orders/${orderId}`),
  /**
   * PATCH /orders/{id}/cancel
   */
  cancelOrder: (orderId) => axiosClient.patch(`/orders/${orderId}/cancel`),
};

export default userService;
