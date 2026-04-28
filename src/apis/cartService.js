import axiosClient from './axiosClient';

const cartService = {
  /**
   * GET /cart
   * Response: { success, data: [{ id, product_id, quantity, product: {...} }] }
   */
  getCart: () => axiosClient.get('/cart'),

  /**
   * POST /cart
   * Body: { product_id, quantity }
   * Response: { success, message, data: cartItem }
   */
  addItem: (productId, quantity = 1) =>
    axiosClient.post('/cart', { product_id: productId, quantity }),

  /**
   * PUT /cart/{id}
   * Body: { quantity }
   * Response: { success, message, data: cartItem }
   */
  updateItem: (cartItemId, quantity) =>
    axiosClient.put(`/cart/${cartItemId}`, { quantity }),

  /**
   * DELETE /cart/{id}
   * Response: { success, message }
   */
  removeItem: (cartItemId) => axiosClient.delete(`/cart/${cartItemId}`),

  /**
   * DELETE /cart
   * Response: { success, message }
   */
  clearCart: () => axiosClient.delete('/cart'),

  /**
   * Sync cart local → server (dùng khi vừa đăng nhập)
   * Gửi lần lượt từng item trong localStorage lên server
   */
  syncLocalCartToServer: async () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    for (const item of localCart) {
      await cartService.addItem(item.id, item.quantity || 1);
    }
    localStorage.removeItem('cart');
  },
};

export default cartService;
