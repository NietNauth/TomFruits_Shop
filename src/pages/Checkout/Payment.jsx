import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, Plus } from 'lucide-react';
import MyHeader from '../../components/Header/Header';
import MyFooter from '../../components/Footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import cartService from '../../apis/cartService';

const SHIPPING_FEE = 30000;
const FREE_SHIP_THRESHOLD = 500000;

const steps = [
  { id: 1, label: 'Thông tin', Icon: MapPin },
  { id: 2, label: 'Thanh toán', Icon: CreditCard },
  { id: 3, label: 'Xác nhận', Icon: CheckCircle },
];

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    emoji: '💵',
  },
  {
    id: 'bank',
    label: 'Chuyển khoản ngân hàng',
    emoji: '🏦',
  },
  {
    id: 'vnpay',
    label: 'VNPay',
    emoji: '💳',
  },
];

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [activeStep] = useState(2);
  const [selected, setSelected] = useState('bank');

  const [cartItems, setCartItems] = useState(
    location.state?.cartItems || JSON.parse(localStorage.getItem('cart')) || []
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // If logged in but cartItems are just IDs or stale, sync from server
    if (isLoggedIn && !location.state?.cartItems) {
      cartService.getCart().then((res) => {
        if (res.success) {
          if (!res.data || res.data.length === 0) {
            navigate('/cart');
            return;
          }
          const normalized = res.data.map(item => {
            const product = item.product || item;
            return {
              ...product,
              quantity: item.quantity || 1,
              cartItemId: item.id
            };
          });
          setCartItems(normalized);
        }
      });
    } else if (isLoggedIn && location.state?.cartItems?.length === 0) {
       navigate('/cart');
    }
  }, [isLoggedIn, location.state]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.png';
    if (img.startsWith('http')) return img;
    return `http://localhost:8000/storage/${img}`;
  };

  const fmt = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';

  return (
    <>
      <MyHeader />
      <div className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Thanh toán &amp; Đặt hàng</h1>
          <div className={styles.steps}>
            {steps.map((s, idx) => (
              <div key={s.id} className={styles.stepGroup}>
                <div
                  className={`${styles.step} ${activeStep === s.id
                      ? styles.stepActive
                      : activeStep > s.id
                        ? styles.stepDone
                        : ''
                    }`}
                >
                  <s.Icon size={14} />
                  <span>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <span className={styles.stepArrow}>›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>
                <CreditCard size={18} />
                Phương thức thanh toán
              </h2>

              {/* PAYMENT OPTIONS */}
              <div className={styles.paymentList}>
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`${styles.paymentItem} ${selected === method.id ? styles.paymentItemActive : ''
                      }`}
                    onClick={() => setSelected(method.id)}
                  >
                    <input
                      type='radio'
                      name='payment'
                      checked={selected === method.id}
                      onChange={() => setSelected(method.id)}
                    />
                    <span className={styles.paymentEmoji}>{method.emoji}</span>
                    <span className={styles.paymentLabel}>{method.label}</span>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className={styles.formActions}>
                <div
                  className={styles.backLink}
                  onClick={() => navigate('/checkout')}
                >
                  ← Quay lại
                </div>
                <button
                  className={styles.continueBtn}
                  onClick={() => {
                    localStorage.setItem('paymentMethod', selected);
                    navigate('/checkout/confirm', { state: { cartItems } });
                  }}
                >
                  Xác nhận →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className={styles.right}>
            <div className={styles.summary}>
              <div className={styles.summaryHeader}>
                Đơn hàng ({cartItems.length})
              </div>

              <div className={styles.summaryBody}>
                <div className={styles.orderItems}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.orderItemThumb}>
                        <img src={getImageUrl(item.img || item.image)} alt={item.name} />
                        <span className={styles.orderItemQtyBadge}>{item.quantity}</span>
                      </div>
                      <div className={styles.orderItemInfo}>
                        <div className={styles.orderItemName}>{item.name}</div>
                        <div className={styles.orderItemPrice}>
                          {fmt((item.price || 0) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.divider} />

                <div className={styles.row}>
                  <span>Tạm tính</span>
                  <span>{fmt(subtotal)}</span>
                </div>

                <div className={styles.row}>
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : fmt(SHIPPING_FEE)}</span>
                </div>

                <div className={styles.divider} />

                <div className={styles.totalRow}>
                  <span>Tổng cộng</span>
                  <span className={styles.totalAmount}>{fmt(total)}</span>
                </div>

                <div className={styles.trust}>
                  🔒 Bảo mật SSL &nbsp;|&nbsp; ✓ Đảm bảo hoàn tiền
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
}

export default PaymentPage;
