import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, Truck } from 'lucide-react';
import MyHeader from '../../components/Header/Header';
import MyFooter from '../../components/Footer/Footer';
import { toast } from 'react-toastify';
import orderService from '../../apis/orderService';
import cartService from '../../apis/cartService';
import { useAuth } from '../../contexts/AuthContext';

const SHIPPING_FEE = 30000;
const FREE_SHIP_THRESHOLD = 500000;
const BANK_INFO = {
  bank: 'Vietcombank',
  account: '1234 5678 9012',
  owner: 'CONG TY TNHH TOM FRUITS',
  content: 'DH + Số điện thoại của bạn',
};

const steps = [
  { id: 1, label: 'Thông tin', Icon: MapPin },
  { id: 2, label: 'Thanh toán', Icon: CreditCard },
  { id: 3, label: 'Xác nhận', Icon: CheckCircle },
];

const PAYMENT_LABELS = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank: 'Chuyển khoản ngân hàng',
  vnpay: 'VNPay',
};

function ConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [activeStep] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cartItems, setCartItems] = useState(
    location.state?.cartItems || JSON.parse(localStorage.getItem('cart')) || []
  );
  
  const shippingInfo = JSON.parse(localStorage.getItem('shipping')) || {};
  const paymentMethod = localStorage.getItem('paymentMethod') || 'Chuyển khoản ngân hàng';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (isLoggedIn && !location.state?.cartItems) {
      cartService.getCart().then(res => {
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
  }, [isLoggedIn, location.state, navigate]);

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

  const fullAddress = [
    shippingInfo.address,
    shippingInfo.phuong,
    shippingInfo.quan,
    shippingInfo.tinh,
  ]
    .filter(Boolean)
    .join(', ');

  const handleOrder = async () => {
    setIsSubmitting(true);
    try {
      const res = await orderService.createOrder({
        payment_method: paymentMethod,
        receiver_name: shippingInfo.fullName,
        receiver_phone: shippingInfo.phone,
        shipping_address: fullAddress,
        note: shippingInfo.note || undefined,
      });

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      sessionStorage.removeItem('checkoutForm');

      if (res.payment_url && paymentMethod === 'vnpay') {
        window.location.href = res.payment_url;
        return;
      }
      
      localStorage.setItem('orderTotal', total.toString());
      navigate('/checkout/success', { state: { order: res.data }, replace: true });
    } catch (err) {
      toast.error(err.message || 'Đặt hàng thất bại, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  className={`${styles.step} ${
                    activeStep === s.id
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
          <div className={styles.left}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>
                <Truck size={18} />
                Xác nhận đơn hàng
              </h2>

              {/* SHIPPING INFO */}
              <div className={styles.infoBox}>
                <div className={styles.infoBoxTitle}>Thông tin giao hàng</div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Người nhận:</span>
                  <strong>{shippingInfo.fullName || '—'}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Điện thoại:</span>
                  <strong>{shippingInfo.phone || '—'}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Địa chỉ:</span>
                  <strong>{fullAddress || '—'}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Thanh toán:</span>
                  <strong>{PAYMENT_LABELS[paymentMethod] || paymentMethod}</strong>
                </div>

                {/* BANK DETAILS - only show if bank is selected */}
                {paymentMethod === 'bank' && (
                  <div className={styles.bankBox}>
                    <div className={styles.bankBoxTitle}>Thông tin chuyển khoản:</div>
                    <div className={styles.bankRow}>Ngân hàng: <strong>{BANK_INFO.bank}</strong></div>
                    <div className={styles.bankRow}>Số TK: <strong>{BANK_INFO.account}</strong></div>
                    <div className={styles.bankRow}>Chủ TK: <strong>{BANK_INFO.owner}</strong></div>
                    <div className={styles.bankRow}>Nội dung: <strong>{BANK_INFO.content}</strong></div>
                  </div>
                )}
              </div>

              {/* CENTRAL ORDER ITEMS LIST */}
              <div className={styles.itemList}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemThumb}>
                      <img src={getImageUrl(item.img || item.image)} alt={item.name} />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemUnit}>
                        x{item.quantity} {item.unit || 'sản phẩm'}
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      {fmt((item.price || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.backBtn}
                onClick={() => navigate('/checkout/payment')}
              >
                ← Quay lại
              </button>
              <button className={styles.orderBtn} onClick={handleOrder} disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : '🛒 Đặt hàng ngay'}
              </button>
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

export default ConfirmPage;
