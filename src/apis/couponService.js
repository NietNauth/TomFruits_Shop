import axiosClient from './axiosClient';

const couponService = {
  /**
   * POST /coupons/apply
   * Body: { code, order_total }
   * Response: { success, data: { discount_amount, discount_type, coupon } }
   */
  applyCoupon: (code, orderTotal) =>
    axiosClient.post('/coupons/apply', { code, order_total: orderTotal }),
};

export default couponService;
