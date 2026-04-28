import styles from './styles.module.scss';
import { CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import MyHeader from '../../../components/Header/Header';
import MyFooter from '../../../components/Footer/Footer';

const PAYMENT_LABELS = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank: 'Chuyển khoản ngân hàng',
  vnpay: 'VNPay',
};

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ưu tiên lấy thông tin từ location.state được truyền từ Confirm.jsx
  const order = location.state?.order || {};
  
  // Nếu không có trong state thì mới lấy từ localStorage (fallback)
  const shippingInfo = JSON.parse(localStorage.getItem('shipping')) || {};
  const paymentMethod = order.payment_method || localStorage.getItem('paymentMethod') || '—';
  const total = order.final_price || parseInt(localStorage.getItem('orderTotal') || '0');
  
  const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';

  const orderId = order.order_code || '#TF-UNSET';

  return (
    <>
      <MyHeader />
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Icon */}
          <div className={styles.iconWrapper}>
            <CheckCircle size={50} />
          </div>

          {/* Title */}
          <h2 className={styles.title}>Đặt hàng thành công!</h2>
          <p className={styles.subtitle}>Cảm ơn bạn đã tin tưởng Tom Fruits!</p>

          {/* Order ID */}
          <p className={styles.orderId}>
            Mã đơn hàng: <span>{orderId}</span>
          </p>

          <p className={styles.note}>
            Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất.
          </p>

          {/* Info box */}
          <div className={styles.infoBox}>
            <div className={styles.row}>
              <span>Người nhận:</span>
              <strong>{order.receiver_name || shippingInfo.fullName || '—'}</strong>
            </div>
            <div className={styles.row}>
              <span>Điện thoại:</span>
              <strong>{order.receiver_phone || shippingInfo.phone || '—'}</strong>
            </div>
            <div className={styles.row}>
              <span>Thanh toán:</span>
              <strong>{PAYMENT_LABELS[paymentMethod] || paymentMethod}</strong>
            </div>
            <div className={styles.row}>
              <span>Tổng tiền:</span>
              <strong className={styles.price}>{fmt(total)}</strong>
            </div>
          </div>

          {/* Button */}
          <button className={styles.button} onClick={() => navigate('/')}>
            Về trang chủ
          </button>
        </div>
      </div>
      <MyFooter />
    </>
  );
}

export default SuccessPage;
